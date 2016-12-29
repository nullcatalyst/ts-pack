import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { resolveModule, transpile } from '../util/transpile';

interface MapLike<T> {
    [id: string]: T;
}

interface SourceFileExt extends ts.SourceFile {
    /**
     * These are references to the top level functions, variables and classes that had to be renamed to coexist in the global scope.
     * This maps the original source code name to the new mangled name
     */
    $ids: MapLike<string | MapLike<string>>;

    /**
     * These are references to the top level functions, variables and classes that had to be renamed to coexist in the global scope.
     * This maps the original source code name to the new mangled name
     */
    $exports: MapLike<string>;

    /**
     * This maps the full resolved source file name to the map of variables it exports
     */
    $imports: MapLike<MapLike<string>>;
}

function extendSourceFile(sourceFile: ts.SourceFile): SourceFileExt {
    const _sourceFile = (sourceFile as SourceFileExt);

    if (!_sourceFile.$ids)     _sourceFile.$ids     = {};
    if (!_sourceFile.$exports) _sourceFile.$exports = {};
    if (!_sourceFile.$imports) _sourceFile.$imports = {};

    return _sourceFile;
}

function importSourceFile(_sourceFile: SourceFileExt, resolvedModulePath: string): tspoon.TranspilerOutput | undefined {
    if (resolvedModulePath in _sourceFile.$imports) {
        // The file has already been imported, no need to import it again
    } else {
        // The file has not yet been imported, so import it here
        const output = transpile(resolvedModulePath, _sourceFile);
        const _importedFile = extendSourceFile(output.ast);

        _sourceFile.$imports[_importedFile.fileName] = _importedFile.$exports;

        // Copy any imports from the imported file down into the parent file
        Object.assign(_sourceFile.$imports, _importedFile.$imports);

        return output;
    }
}

export function addId(sourceFile: ts.SourceFile, id: string, _export: boolean, _default: boolean): void {
    const _sourceFile = extendSourceFile(sourceFile);
    const fileName = _sourceFile.fileName;
    const prefix = _export ? '_pbl__' : '_prv__';
    const postfix = '__' + fileName.substr(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gmi, '_');

    _sourceFile.$ids[id] = prefix + id + postfix;
    if (_export) _sourceFile.$exports[id] = prefix + id + postfix;
    if (_default) _sourceFile.$exports[''] = prefix + id + postfix;
}

export function getId(sourceFile: ts.SourceFile, id: string, property?: string): string | undefined {
    const _sourceFile = extendSourceFile(sourceFile);

    if (id in _sourceFile.$ids) {
        if (property) {
            if (typeof _sourceFile.$ids[id] === 'object') return _sourceFile.$ids[id][property];
        } else {
            if (typeof _sourceFile.$ids[id] === 'string') return _sourceFile.$ids[id] as string;
        }
    }
}

export function addImportFile(sourceFile: ts.SourceFile, moduleName: string, importedAs: string | [string, string][], _default: boolean): tspoon.TranspilerOutput | undefined {
    const _sourceFile = extendSourceFile(sourceFile);
    const resolvedModulePath = resolveModule(moduleName, _sourceFile.fileName);

    if (resolvedModulePath) {
        const output = importSourceFile(_sourceFile, resolvedModulePath);

        if (typeof importedAs === 'string') {
            if (_default) {
                _sourceFile.$ids[importedAs] = _sourceFile.$imports[resolvedModulePath][''];
            } else {
                _sourceFile.$ids[importedAs] = _sourceFile.$imports[resolvedModulePath];
            }
        } else if (typeof importedAs === 'object') {
            importedAs.forEach(importedProperty => {
                _sourceFile.$ids[importedProperty[1]] = _sourceFile.$imports[resolvedModulePath][importedProperty[0]];
            });
        }

        return output;
    } else {
        throw new Error();
    }
}

export function addExportFile(sourceFile: ts.SourceFile, moduleName: string, exportedProps?: [string, string][]): tspoon.TranspilerOutput | undefined {
    const _sourceFile = extendSourceFile(sourceFile);
    const resolvedModulePath = resolveModule(moduleName, _sourceFile.fileName);

    if (resolvedModulePath) {
        const output = importSourceFile(_sourceFile, resolvedModulePath);

        if (!exportedProps) {
            Object.assign(_sourceFile.$exports, _sourceFile.$imports[resolvedModulePath]);
        } else {
            exportedProps.forEach(([ exportedProp, exportedPropAs ]) => {
                _sourceFile.$exports[exportedPropAs] = _sourceFile.$imports[resolvedModulePath][exportedProp];
            });
        }

        return output;
    } else {
        throw new Error();
    }
}
