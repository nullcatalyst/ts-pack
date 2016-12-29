import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { VisitorContext, Context } from '../context';

function isPropertyContainer(node: ts.Node): boolean {
    if (node.parent.kind !== ts.SyntaxKind.PropertyAccessExpression) {
        return true;
    } else {
        const parent = node.parent as ts.PropertyAccessExpression;

        return parent.expression === node && parent.parent.kind !== ts.SyntaxKind.PropertyAccessExpression;
    }
}

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.Identifier
            && node.parent.kind !== ts.SyntaxKind.ExportAssignment          // export default X; -OR- export = X;
            && node.parent.kind !== ts.SyntaxKind.ImportClause              // import X from <module>;
            && node.parent.kind !== ts.SyntaxKind.ImportSpecifier           // import { X as Y } from <module>;
            && node.parent.kind !== ts.SyntaxKind.MethodDeclaration         // class Y { X() { ... } };
            && node.parent.kind !== ts.SyntaxKind.PropertyDeclaration       // class Y { X: string };
            && isPropertyContainer(node); // Y.X;
    },
    visit: function visit(node: ts.VariableStatement, context: VisitorContext) {
        const replaceId = context.custom.getId(node.getText());

        if (replaceId) {
            context.replace(node.getStart(), node.getEnd(), replaceId);
        }
    }
};

export default impl;
