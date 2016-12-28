import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { getSourceFileImport } from '../util/source-file';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.PropertyAccessExpression
            && (node as ts.PropertyAccessExpression).expression.kind === ts.SyntaxKind.Identifier;
    },
    visit: function visit(node: ts.PropertyAccessExpression, context: tspoon.VisitorContext) {
        // console.log(node);

        const importedAs = node.expression.getText();
        const property = node.name.getText();

        const actualProperty = getSourceFileImport(node.getSourceFile(), importedAs, property);
        if (actualProperty) {
            context.replace(node.getStart(), node.getEnd(), actualProperty);
        }
    }
} as tspoon.Visitor;
