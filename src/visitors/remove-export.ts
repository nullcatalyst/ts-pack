import * as ts from 'typescript';
import * as tspoon from 'tspoon';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ExportKeyword;
    },
    visit: function visit(node: ts.Node, context: tspoon.VisitorContext) {
        // Remove the export keyword
        context.replace(node.getStart(), node.getEnd(), '');
    }
} as tspoon.Visitor;
