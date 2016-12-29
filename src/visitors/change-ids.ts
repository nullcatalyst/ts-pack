import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { getId } from '../util/source-file';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.Identifier
            && node.parent.kind !== ts.SyntaxKind.ImportSpecifier
            && node.parent.kind !== ts.SyntaxKind.MethodDeclaration
            && node.parent.kind !== ts.SyntaxKind.PropertyDeclaration
            && node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression;
    },
    visit: function visit(node: ts.VariableStatement, context: tspoon.VisitorContext) {
        const replaceId = getId(node.getSourceFile(), node.getText());

        if (replaceId) {
            context.replace(node.getStart(), node.getEnd(), replaceId);
        }
    }
} as tspoon.Visitor;
