import * as ts from 'typescript';
import * as tspoon from '../tspoon';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ExportAssignment;
    },
    visit: function visit(node: ts.ExportAssignment, context: VisitorContext) {
        if (node.isExportEquals) {
            // export = <expression>
            // throw new Error('Unimplemented :(');
        } else {
            // export default <identifier>
            if (node.expression.kind === ts.SyntaxKind.Identifier) {
                context.custom.addDefault(node.expression.getText());

                // Remove the export
                context.replace(node.getStart(), node.getEnd(), '');
            } else {
                // export default <expression>
                // e.g.: export default 1;

                let mangledId = context.custom.addDefault();

                // Change the export into a variable
                context.replace(node.getStart(), node.getEnd(), `const ${mangledId} = ${node.expression.getText()};`);
            }
        }
    }
};

export default impl;
