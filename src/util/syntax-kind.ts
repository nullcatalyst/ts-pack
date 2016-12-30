import * as ts from 'typescript';

export function getSyntaxKindName(syntaxKind: ts.SyntaxKind): string | undefined {
    for (let property in ts.SyntaxKind) {
        if (ts.SyntaxKind[property] as any === syntaxKind) {
            return property;
        }
    }
}
