import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import resolveModule from './util/resolve-module';
import VISITORS from './visitors';

interface MapLike<T> { [id: string]: T }

/** import { string[0] as string[1] } from <module> */
type ImportedPropertyName = [string, string];

export interface VisitorContext extends tspoon.VisitorContext {
    custom?: Context;
}

export interface TranspilerOutput extends tspoon.TranspilerOutput {
    custom?: Context;
}

const COMPILER_OPTIONS = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2016,
};

export class Context {
    /** The source file that this context was created by/for */
    private sourceFile: ts.SourceFile;

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
    private imports: MapLike<Context>;

    constructor(sourceFile: ts.SourceFile, parent?: Context) {
        this.sourceFile = sourceFile;
        this.parent     = parent;
        this.ids        = {};
        this.exports    = {};
        this.imports    = parent ? parent.imports : {};

        this.imports[sourceFile.fileName] = this;
    }

    /**
     * Mangles the identifier, creating a globally unique name
     * This can be overridden or swapped out if desired
     */
    mangleId(id: string, _export: boolean): string {
        const fileName = this.sourceFile.fileName;
        const prefix = _export ? '_pbl__' : '_prv__';
        const postfix = '__' + fileName.substr(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gmi, '_');

        return prefix + id + postfix;
    }

    addId(id: string, _export: boolean, _default: boolean): void {
        const mangledId = this.mangleId(id, _export);

        this.ids[id] = mangledId;
        if (_export) this.exports[id] = mangledId;
        if (_default) this.exports[''] = mangledId;
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

    static transpile(modulePath: string, parentContext?: Context): TranspilerOutput {
        let custom: Context;

        const fileContents = ts.sys.readFile(modulePath);
        const config: tspoon.TranspilerConfig = {
            sourceFileName: modulePath,
            compilerOptions: COMPILER_OPTIONS,
            visitors: VISITORS,
            onBeforeTranspile: (ast: ts.SourceFile, context: VisitorContext) => {
                custom = new Context(ast, parentContext);
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
            const output = Context.transpile(resolvedModulePath, this);

            // this.imports[output.custom.sourceFile.fileName] = output.custom.exports;

            // Copy any imports from the imported file down into the parent file
            // Object.assign(_sourceFile.$imports, _importedFile.$imports);

            return output;
        }
    }

    addImport(moduleName: string, importedAs: string | ImportedPropertyName[], _default: boolean): TranspilerOutput | null | undefined {
        const resolvedModulePath = resolveModule(moduleName, this.sourceFile.fileName);

        if (resolvedModulePath) {
            const output = this.importModule(resolvedModulePath);

            if (typeof importedAs === 'string') {
                if (_default) {
                    this.ids[importedAs] = this.imports[resolvedModulePath].exports[''];
                } else {
                    this.ids[importedAs] = this.imports[resolvedModulePath].exports;
                }
            } else if (typeof importedAs === 'object') {
                importedAs.forEach(importedProperty => {
                    this.ids[importedProperty[1]] = this.imports[resolvedModulePath].exports[importedProperty[0]];
                });
            }

            return output;
        } else if (!(moduleName in this.imports)) {
            this.imports[moduleName] = null;
            return null;
        }
    }

    addExport(moduleName: string, exportedProps?: ImportedPropertyName[]): TranspilerOutput | null | undefined {
        const resolvedModulePath = resolveModule(moduleName, this.sourceFile.fileName);

        if (resolvedModulePath) {
            const output = this.importModule(resolvedModulePath);

            if (!exportedProps) {
                Object.assign(this.exports, this.imports[resolvedModulePath].exports);
            } else {
                exportedProps.forEach(([ exportedProp, exportedPropAs ]) => {
                    this.exports[exportedPropAs] = this.imports[resolvedModulePath].exports[exportedProp];
                });
            }

            return output;
        } else if (!(moduleName in this.imports)) {
            this.imports[moduleName] = null;
            return null;
        }
    }
}
