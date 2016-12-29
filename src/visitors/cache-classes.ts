import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { addId } from '../util/source-file';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ClassDeclaration
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.ClassDeclaration, context: tspoon.VisitorContext) {
        const exported = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);

        addId(node.getSourceFile(), node.name.getText(), exported);
    }
} as tspoon.Visitor;
