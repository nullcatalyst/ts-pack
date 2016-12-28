import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { addSourceFileIdentifier } from '../util/source-file-ids';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.FunctionDeclaration
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.FunctionDeclaration, context: tspoon.VisitorContext) {
        const exported = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);

        addSourceFileIdentifier(node.getSourceFile(), node.name.getText(), exported);
    }
} as tspoon.Visitor;