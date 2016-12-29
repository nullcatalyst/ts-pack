import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { getId } from '../util/source-file';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.PropertyAccessExpression
            && (node as ts.PropertyAccessExpression).expression.kind === ts.SyntaxKind.Identifier;
    },
    visit: function visit(node: ts.PropertyAccessExpression, context: tspoon.VisitorContext) {
        const importedAs = node.expression.getText();
        const property = node.name.getText();

        const actualProperty = getId(node.getSourceFile(), importedAs, property);
        if (actualProperty) {
            context.replace(node.getStart(), node.getEnd(), actualProperty);
        }
    }
};

export default impl;
