import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { VisitorContext } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ExportKeyword;
    },
    visit: function visit(node: ts.Node, context: VisitorContext) {
        // Remove the export keyword
        context.replace(node.getStart(), node.getEnd(), '');
    }
};

export default impl;
