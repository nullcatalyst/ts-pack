import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ExportAssignment;
    },
    visit: function visit(node: ts.ExportAssignment, context: VisitorContext) {
        if (node.isExportEquals) {
            // export = <expression>
            throw new Error('unimplemented');
        } else {
            // export default <expression>
            context.custom.addDefault(node.expression.getText());

            // Remove the export
            context.replace(node.getStart(), node.getEnd(), '');
        }
    }
};

export default impl;
