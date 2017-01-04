import * as ts from 'typescript';
import * as tspoon from '../tspoon';
import { Mangle } from '../util/compiler-options';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.VariableStatement
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.VariableStatement, context: VisitorContext) {
        let mangle = Mangle.Internal;
        if (node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword))  mangle = Mangle.Export;
        if (node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)) mangle = Mangle.DefaultExport;

        node.declarationList.declarations.forEach((decl: ts.VariableDeclaration) => {
            context.custom.addId(decl.name.getText(), mangle);
        });
    }
};

export default impl;
