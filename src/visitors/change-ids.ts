import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { getSourceFileIdentifier } from '../util/source-file-ids';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.Identifier;
    },
    visit: function visit(node: ts.VariableStatement, context: tspoon.VisitorContext) {
        const replaceId = getSourceFileIdentifier(node.getSourceFile(), node.getText());

        if (replaceId) {
            context.replace(node.getStart(), node.getEnd(), replaceId);
        }
    }
} as tspoon.Visitor;
