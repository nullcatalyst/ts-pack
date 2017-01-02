import * as ts from 'typescript';
import * as tspoon from '../tspoon';
import { MangleType } from '../util/compiler-options';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.FunctionDeclaration
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.FunctionDeclaration, context: VisitorContext) {
        let mangle: MangleType = 'private';
        if (node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) mangle = 'export';
        if (node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)) mangle = 'default';

        let mangledId = context.custom.addId(node.name ? node.name.getText() : '', mangle);

        if (!node.name) context.insert(node.getStart() + node.getText().indexOf('function') + 'function'.length, ' ' + mangledId);
    }
};

export default impl;
