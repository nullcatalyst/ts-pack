import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { addId } from '../util/source-file';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.FunctionDeclaration
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.FunctionDeclaration, context: tspoon.VisitorContext) {
        const _export = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
        const _default = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.DefaultKeyword);

        addId(node.getSourceFile(), node.name.getText(), _export, _default);
    }
};

export default impl;
