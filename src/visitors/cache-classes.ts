import * as ts from 'typescript';
import * as tspoon from '../tspoon';
import { MangleType } from '../util/compiler-options';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ClassDeclaration
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.ClassDeclaration, context: VisitorContext) {
        let mangle: MangleType = 'private';
        if (node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) mangle = 'export';
        if (node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)) mangle = 'default';

        context.custom.addId(node.name.getText(), mangle);
    }
};

export default impl;
