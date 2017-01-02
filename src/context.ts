import * as path from 'path';
import * as builtinModules from 'builtin-modules';
import * as ts from 'typescript';
import * as tspoon from './tspoon';
import { CompilerOptions, MangleType } from './util/compiler-options';
import VISITORS from './visitors';

interface MapLike<T> { [id: string]: T }

const MODULE_HOST: ts.ModuleResolutionHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
};

/** import { string[0] as string[1] } from <module> */
export type ImportedPropertyName = [string, string];

export interface VisitorContext extends tspoon.VisitorContext {
    custom?: Context;
}

export interface TranspilerOutput extends tspoon.TranspilerOutput {
    custom?: Context;
}

export class Context {
    /** The compiler options to pass through to typescript when loading any additional modules */
    private options: CompilerOptions;

    /** The source file that this context was created by/for */
    private sourceFile: ts.SourceFile;

    /** A reference to the parent Context, the Context that imported this one */
    private parent?: Context;

    /**
     * These are references to the top level functions, variables and classes that had to be renamed to coexist in the global scope.
     * This maps the original source code name to the new mangled name
     */
    private ids: MapLike<string | MapLike<string>>;

    /**
     * These are references to the top level functions, variables and classes that had to be renamed to coexist in the global scope.
     * This maps the original source code name to the new mangled name
     */
    private exports: MapLike<string>;

    /**
     * This maps the full resolved source file name to the map of variables it exports
     */
    private imports: MapLike<Context | string>;

    constructor(options: CompilerOptions, sourceFile: ts.SourceFile, parent?: Context) {
        this.options    = options;
        this.sourceFile = sourceFile;
        this.parent     = parent;
        this.ids        = {};
        this.exports    = {};
        this.imports    = parent ? parent.imports : {};

        this.imports[sourceFile.fileName] = this;
    }

    /** Mangles the identifier, creating a globally unique name */
    private mangleId(id: string, mangle: MangleType, fileName?: string): string {
        fileName = fileName || this.sourceFile.fileName;

        if (this.options.mangleId) {
            return this.options.mangleId(fileName, id, mangle);
        } else {
            let prefix: string;
            switch (mangle) {
                case 'private': prefix = 'prvt$'; break;
                case 'default': prefix = 'pblc$'; break;
                case 'export':  prefix = 'pblc$'; break;
                case 'node':    prefix = 'node$'; break;
            }

            const extIndex = fileName.lastIndexOf('.');
            const postfix = '$' + (extIndex >= 0 ? fileName.substr(0, fileName.lastIndexOf('.')) : fileName).replace(/[^a-z0-9]/gmi, '_');

            return prefix + id + postfix;
        }
    }

    private resolveModule(moduleName: string, parentPath?: string): string | undefined {
        parentPath = parentPath || '';

        const resolvedModule = ts.resolveModuleName(moduleName, parentPath, this.options || {}, MODULE_HOST);
        let resolvedModuleName = resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName;

        // if (resolvedModuleName && resolvedModuleName[0] !== '/' && this.options['baseUrl']) {
        //     resolvedModuleName = path.join(this.options['baseUrl'], resolvedModuleName);
        // }

        return resolvedModuleName;
    }

    private isNodeModule(modulePath: string): boolean {
        if (builtinModules.indexOf(modulePath) >= 0) {
            return true;
        } else {
            return modulePath.indexOf('/node_modules/') >= 0 || modulePath.indexOf('node_modules/') === 0;
        }
    }

    addId(id: string, mangle: MangleType): void {
        const mangledId = this.mangleId(id, mangle);

        this.ids[id] = mangledId;
        if (mangle === 'export')  this.exports[id] = mangledId;
        if (mangle === 'default') this.exports[''] = mangledId;
    }

    addDefault(id: string): void {
        this.exports[''] = this.ids[id] as string;
    }

    getId(id: string, property?: string): string | undefined {
        if (id in this.ids) {
            if (property) {
                if (typeof this.ids[id] === 'object') return this.ids[id][property];
            } else {
                if (typeof this.ids[id] === 'string') return this.ids[id] as string;
            }
        }
    }

    static transpile(options: CompilerOptions, modulePath: string, parentContext?: Context): TranspilerOutput {
        let custom: Context;

        const fileContents = ts.sys.readFile(modulePath);
        const config: tspoon.TranspilerConfig = {
            sourceFileName: modulePath,
            compilerOptions: options,
            visitors: VISITORS,
            onBeforeTranspile: (ast: ts.SourceFile, context: VisitorContext) => {
                custom = new Context(options, ast, parentContext);
                context.custom = custom;
            },
        };

        const output: TranspilerOutput = tspoon.transpile(fileContents, config);
        output.custom = custom;
        return output;
    }

    private importModule(resolvedModulePath: string): TranspilerOutput | undefined {
        if (resolvedModulePath in this.imports) {
            // The file has already been imported, no need to import it again
        } else {
            // The file has not yet been imported, so import it here
            return Context.transpile(this.options, resolvedModulePath, this);
        }
    }

    addImport(moduleName: string, importedAs: string | ImportedPropertyName[], _default: boolean): TranspilerOutput | string | undefined {
        let resolvedModulePath = this.resolveModule(moduleName, this.sourceFile.fileName);
        const nodeModule = this.isNodeModule(resolvedModulePath || moduleName);
        if (!resolvedModulePath && !nodeModule) return;

        if (nodeModule) {
            resolvedModulePath = resolvedModulePath || moduleName;

            const assignIds = (id: string) => {
                if (typeof importedAs === 'string') {
                    this.ids[importedAs] = id;
                } else if (typeof importedAs === 'object') {
                    importedAs.forEach(importedProperty => {
                        this.ids[importedProperty[1]] = id + '.' + importedProperty[0];
                    });
                }
            };

            if (moduleName in this.imports) {
                assignIds(this.imports[moduleName] as string);
            } else {
                let id = this.mangleId('', 'node', resolvedModulePath);
                this.imports[moduleName] = id;
                assignIds(id);
                return id;
            }
        } else {
            const output = this.importModule(resolvedModulePath);

            if (typeof importedAs === 'string') {
                if (_default) {
                    this.ids[importedAs] = (this.imports[resolvedModulePath] as Context).exports[''];
                } else {
                    this.ids[importedAs] = (this.imports[resolvedModulePath] as Context).exports;
                }
            } else if (typeof importedAs === 'object') {
                importedAs.forEach(importedProperty => {
                    this.ids[importedProperty[1]] = (this.imports[resolvedModulePath] as Context).exports[importedProperty[0]];
                });
            }

            return output;
        }
    }

    addExport(moduleName: string, exportedProps?: ImportedPropertyName[]): TranspilerOutput | string | undefined {
        let resolvedModulePath = this.resolveModule(moduleName, this.sourceFile.fileName);
        const nodeModule = this.isNodeModule(resolvedModulePath || moduleName);
        if (!resolvedModulePath && !nodeModule) return;

        if (nodeModule) {
            resolvedModulePath = resolvedModulePath || moduleName;
            if (!(resolvedModulePath in this.imports)) {
                let id = this.mangleId('', 'node', resolvedModulePath);
                this.imports[moduleName] = id;
                return id;
            }
        } else {
            const output = this.importModule(resolvedModulePath);

            if (!exportedProps) {
                // Copy all of the exports over
                Object.assign(this.exports, (this.imports[resolvedModulePath] as Context).exports);
            } else {
                exportedProps.forEach(([ exportedProp, exportedPropAs ]) => {
                    this.exports[exportedPropAs] = (this.imports[resolvedModulePath] as Context).exports[exportedProp];
                });
            }

            return output;
        }
    }
}
