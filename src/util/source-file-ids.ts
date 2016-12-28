import * as ts from 'typescript';

interface SourceFileExt extends ts.SourceFile {
    $ids: { [id: string]: string };
}

export function addSourceFileIdentifier(sourceFile: ts.SourceFile, id: string, exported: boolean): void {
    const fileName = sourceFile.fileName;
    const prefix = exported ? '' : '__';
    const postfix = '__' + fileName.substr(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gmi, '_');

    if (!(sourceFile as SourceFileExt).$ids) {
        (sourceFile as SourceFileExt).$ids = {};
    }

    (sourceFile as SourceFileExt).$ids[id] = prefix + id + postfix;
}

export function getSourceFileIdentifier(sourceFile: ts.SourceFile, id: string): string | undefined {
    if (id in (sourceFile as SourceFileExt).$ids) {
        return (sourceFile as SourceFileExt).$ids[id];
    }
}
