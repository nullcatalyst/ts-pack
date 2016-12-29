import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { getSourceFileIdentifier } from '../util/source-file';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.Identifier
            && node.parent.kind !== ts.SyntaxKind.ImportSpecifier;
    },
    visit: function visit(node: ts.VariableStatement, context: tspoon.VisitorContext) {
        const replaceId = getSourceFileIdentifier(node.getSourceFile(), node.getText());

        if (replaceId) {
            context.replace(node.getStart(), node.getEnd(), replaceId);
        }
    }
} as tspoon.Visitor;
