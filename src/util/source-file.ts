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
    $ids: MapLike<string>;

    /**
     * This maps the full resolved source file name to the map of variables it exports
     */
    $imports: MapLike<MapLike<string>>;

    /**
     * This maps the name a file was imported as to the map of variables it exports
     */
    $importedAs: MapLike<MapLike<string>>;
}

export function addSourceFileIdentifier(sourceFile: ts.SourceFile, id: string, exported: boolean): void {
    const _sourceFile = (sourceFile as SourceFileExt);
    const fileName = _sourceFile.fileName;
    const prefix = exported ? '' : '__';
    const postfix = '__' + fileName.substr(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gmi, '_');

    if (!_sourceFile.$ids) _sourceFile.$ids = {};

    _sourceFile.$ids[id] = prefix + id + postfix;
}

export function getSourceFileIdentifier(sourceFile: ts.SourceFile, id: string): string | undefined {
    const _sourceFile = (sourceFile as SourceFileExt);

    if (id in _sourceFile.$ids) {
        return _sourceFile.$ids[id];
    }
}

export function addSourceFileImport(sourceFile: ts.SourceFile, moduleName: string, importedAs?: string | [string, string][], exported?: boolean): tspoon.TranspilerOutput | undefined {
    const _sourceFile = (sourceFile as SourceFileExt);
    const resolvedModulePath = resolveModule(moduleName, sourceFile.fileName);

    if (!_sourceFile.$ids) _sourceFile.$ids = {};
    if (!_sourceFile.$imports) _sourceFile.$imports = {};
    if (!_sourceFile.$importedAs) _sourceFile.$importedAs = {};

    function addImportAs(imports: MapLike<string>, exported?: boolean) {
        if (importedAs) {
            if (typeof importedAs === 'string') {
                _sourceFile.$importedAs[importedAs] = imports;

                if (exported) Object.assign(_sourceFile.$ids, imports);
            } else if (Array.isArray(importedAs)) {
                importedAs.forEach(importedProperty => {
                    _sourceFile.$ids[importedProperty[1]] = imports[importedProperty[0]];

                    // if (exported) Object.assign(_sourceFile.$ids, imports);
                });
            }
        }
    }

    if (resolvedModulePath in _sourceFile.$imports) {
        // The file has already been imported, no need to import it again

        // Add a way to reference the previously imported file
        addImportAs(_sourceFile.$imports[resolvedModulePath]);
    } else {
        // The file has not yet been imported, so import it here
        const output = transpile(resolvedModulePath);
        const importedFile = output.ast;
        const _importedFile = (importedFile as SourceFileExt);

        _sourceFile.$imports[importedFile.fileName] = _importedFile.$ids;

        addImportAs(_importedFile.$ids);

        // Copy any imports from the imported file down into the parent file
        Object.assign(_sourceFile.$imports, _importedFile.$imports);

        return output;
    }
}

export function getSourceFileImport(sourceFile: ts.SourceFile, importedAs: string, property: string): string | undefined {
    const _sourceFile = (sourceFile as SourceFileExt);

    if (
        importedAs in _sourceFile.$importedAs &&
        property in _sourceFile.$importedAs[importedAs]
    ) {
        return _sourceFile.$importedAs[importedAs][property];
    }
}
