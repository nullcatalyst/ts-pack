import * as ts from 'typescript';
import * as tspoon from '../tspoon';
import { Mangle } from '../util/compiler-options';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.EnumDeclaration
            && node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ConstKeyword);
    },
    visit: function visit(node: ts.EnumDeclaration, context: VisitorContext) {
        let mangle = Mangle.Internal;
        if (node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword))  mangle = Mangle.Export;
        if (node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)) mangle = Mangle.DefaultExport;

        const enumValues: { [id: string]: string } = {};
        let prev = 0;

        node.members.forEach((enumMember) => {
            let name = enumMember.name.getText();
            let value: string;

            if (enumMember.initializer) {
                if (enumMember.initializer.kind === ts.SyntaxKind.NumericLiteral) {
                    prev = +enumMember.initializer.getText();
                } else {
                    throw new Error('Unimplemented');
                }
            }

            value = prev + ' /* ' + name + ' */';
            ++prev;

            enumValues[name] = value;
        });

        context.custom.addEnum(node.name.getText(), enumValues, mangle);
    }
};

export default impl;
