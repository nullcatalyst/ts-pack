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

        const enumOutput: { [id: string]: string } = {};
        const enumValues: { [id: string]: number } = {};
        let prev = 0;

        node.members.forEach((enumMember) => {
            let name = enumMember.name.getText();

            if (enumMember.initializer) {
                prev = handleNode(enumMember.initializer);
            }

            enumOutput[name] = prev + ' /* ' + name + ' */';
            enumValues[name] = prev;
            ++prev;

            function handleNode(node: ts.Expression): number {
                if (node.kind === ts.SyntaxKind.NumericLiteral) {
                    return +node.getText();
                } else if (node.kind === ts.SyntaxKind.Identifier) {
                    return enumValues[node.getText()];
                } else if (node.kind === ts.SyntaxKind.BinaryExpression) {
                    let binExprNode = node as ts.BinaryExpression;

                    switch (binExprNode.operatorToken.kind) {
                        case ts.SyntaxKind.PlusToken: // Add
                            return handleNode(binExprNode.left) + handleNode(binExprNode.right);

                        case ts.SyntaxKind.MinusToken: // Subtract
                            return handleNode(binExprNode.left) - handleNode(binExprNode.right);

                        case ts.SyntaxKind.AsteriskToken: // Multiply
                            return handleNode(binExprNode.left) * handleNode(binExprNode.right);

                        case ts.SyntaxKind.SlashToken: // Divide
                            return handleNode(binExprNode.left) / handleNode(binExprNode.right);

                        case ts.SyntaxKind.PercentToken: // Modulus
                            return handleNode(binExprNode.left) % handleNode(binExprNode.right);

                        case ts.SyntaxKind.BarToken: // Bitwise Or
                            return handleNode(binExprNode.left) | handleNode(binExprNode.right);

                        case ts.SyntaxKind.AmpersandToken: // Bitwise And
                            return handleNode(binExprNode.left) & handleNode(binExprNode.right);
                    }
                }

                // We should never reach here
                throw new Error('Unimplemented');
            }
        });

        context.custom.addEnum(node.name.getText(), enumOutput, mangle);
    }
};

export default impl;
