import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ClassDeclaration
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.ClassDeclaration, context: VisitorContext) {
        const _export = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
        const _default = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.DefaultKeyword);

        context.custom.addId(node.name.getText(), _export, _default);
    }
};

export default impl;
