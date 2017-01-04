import * as ts from 'typescript';
import * as tspoon from '../tspoon';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ExportDeclaration
            && !(node as ts.ExportDeclaration).moduleSpecifier;
    },
    visit: function visit(node: ts.ExportDeclaration, context: VisitorContext) {
        let exportedProperties = node.exportClause.elements.map((decl): [string, string] => {
            // export { <exportedName> } from <modulePath>
            // export { <exportedName> as <exportedAs> } from <modulePath>
            let exportedAs = decl.name.getText();
            let exportedName = decl.propertyName ? decl.propertyName.getText() : exportedAs;
            return [exportedName, exportedAs];
        });

        context.custom.addExport(exportedProperties);

        // Remove the export
        context.replace(node.getStart(), node.getEnd(), '');
    }
};

export default impl;
