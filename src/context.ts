import * as path from 'path';
import * as builtinModules from 'builtin-modules';
import * as ts from 'typescript';
import * as tspoon from './tspoon';
import { CompilerOptions, Mangle, cloneTypescriptOptions } from './util/compiler-options';
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
    private exports: MapLike<string | MapLike<string>>;

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
    private mangleId(id: string, mangle: Mangle, fileName?: string): string {
        return this.options.packOptions.mangleId(fileName || this.sourceFile.fileName, id, mangle);
    }

    private resolveModule(moduleName: string, parentPath?: string): string | undefined {
        parentPath = parentPath || '';

        const resolvedModule = ts.resolveModuleName(moduleName, parentPath, this.options || {}, MODULE_HOST);
        let resolvedModuleName = resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName;

        return resolvedModuleName;
    }

    private isNodeModule(modulePath: string): boolean {
        if (builtinModules.indexOf(modulePath) >= 0) {
            return true;
        } else {
            return modulePath.indexOf('/node_modules/') >= 0 || modulePath.indexOf('node_modules/') === 0;
        }
    }

    addId(id: string, mangle: Mangle): string {
        const mangledId = this.mangleId(id, mangle);

        this.ids[id] = mangledId;
        if (mangle === Mangle.Export)        this.exports[id] = mangledId;
        if (mangle === Mangle.DefaultExport) this.exports[''] = mangledId;

        return mangledId;
    }

    addDefault(id?: string): string {
        let mangledId: string;

        if (id) {
            mangledId = this.ids[id] as string;
        } else {
            mangledId = this.mangleId('', Mangle.DefaultExport);
        }

        this.exports[''] = mangledId;
        return mangledId;
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

    addEnum(name: string, enumValues: { [id: string]: string }, mangle: Mangle): void {
        this.ids[name] = enumValues;

        switch (mangle) {
            case Mangle.DefaultExport:
                this.exports[''] = enumValues;
                // fallthrough;

            case Mangle.Export:
                this.exports[name] = enumValues;
                break;
        }
    }

    addExport(exportedProps: ImportedPropertyName[]): void {
        exportedProps.forEach(([ exportedProp, exportedPropAs ]) => {
            this.exports[exportedPropAs] = this.ids[exportedProp] as string;
        });
    }

    static transpile(options: CompilerOptions, modulePath: string, contents: string, parentContext?: Context): TranspilerOutput {
        let custom: Context;

        const config: tspoon.TranspilerConfig = {
            sourceFileName: modulePath,
            compilerOptions: cloneTypescriptOptions(options),
            visitors: VISITORS,
            onBeforeTranspile: (ast: ts.SourceFile, context: VisitorContext) => {
                custom = new Context(options, ast, parentContext);
                context.custom = custom;
            },
        };

        const output: TranspilerOutput = tspoon.transpile(contents, config);
        output.custom = custom;
        return output;
    }

    static transpileFile(options: CompilerOptions, filePath: string, parentContext?: Context): TranspilerOutput {
        const fileContents = ts.sys.readFile(filePath);
        return Context.transpile(options, filePath, fileContents, parentContext);
    }

    private importModule(resolvedModulePath: string): TranspilerOutput | undefined {
        if (resolvedModulePath in this.imports) {
            // The file has already been imported, no need to import it again
        } else {
            // The file has not yet been imported, so import it here
            return Context.transpileFile(this.options, resolvedModulePath, this);
        }
    }

    addImportModule(moduleName: string, importedAs: string | ImportedPropertyName[], _default: boolean): TranspilerOutput | string | undefined {
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
                let id = this.mangleId('', Mangle.NodeModuleImport, resolvedModulePath);
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
                    this.ids[importedAs] = (this.imports[resolvedModulePath] as Context).exports as MapLike<string>;
                }
            } else if (typeof importedAs === 'object') {
                importedAs.forEach(importedProperty => {
                    this.ids[importedProperty[1]] = (this.imports[resolvedModulePath] as Context).exports[importedProperty[0]];
                });
            }

            return output;
        }
    }

    addExportModule(moduleName: string): TranspilerOutput | string | undefined;
    addExportModule(moduleName: string, exportedProps: ImportedPropertyName[]): TranspilerOutput | undefined;
    addExportModule(moduleName: string, exportedProps?: ImportedPropertyName[]): TranspilerOutput | string | undefined {
        let resolvedModulePath = this.resolveModule(moduleName, this.sourceFile.fileName);
        const nodeModule = this.isNodeModule(resolvedModulePath || moduleName);
        if (!resolvedModulePath && !nodeModule) return;

        if (nodeModule) {
            resolvedModulePath = resolvedModulePath || moduleName;
            if (!(resolvedModulePath in this.imports)) {
                let id = this.mangleId('', Mangle.NodeModuleImport, resolvedModulePath);
                this.imports[moduleName] = id;
                return id;
            }
        } else {
            const output = this.importModule(resolvedModulePath);

            if (exportedProps) {
                exportedProps.forEach(([ exportedProp, exportedPropAs ]) => {
                    this.exports[exportedPropAs] = (this.imports[resolvedModulePath] as Context).exports[exportedProp];
                });
            } else {
                // Copy all of the exports over
                Object.assign(this.exports, (this.imports[resolvedModulePath] as Context).exports);
            }

            return output;
        }
    }
}
