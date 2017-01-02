import * as ts from 'typescript';
import * as tspoon from '../tspoon';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.PropertyAccessExpression
            && (node as ts.PropertyAccessExpression).expression.kind === ts.SyntaxKind.Identifier;
    },
    visit: function visit(node: ts.PropertyAccessExpression, context: VisitorContext) {
        const importedAs = node.expression.getText();
        const property = node.name.getText();

        const actualProperty = context.custom.getId(importedAs, property);
        if (actualProperty) {
            context.replace(node.getStart(), node.getEnd(), actualProperty);
        }
    }
};

export default impl;
