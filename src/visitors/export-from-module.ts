import * as ts from 'typescript';
import * as tspoon from '../tspoon';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ExportDeclaration
            && !!(node as ts.ExportDeclaration).moduleSpecifier;
    },
    visit: function visit(node: ts.ExportDeclaration, context: VisitorContext) {
        // This is the module to be loaded, after removing the quotes
        let moduleName = node.moduleSpecifier.getText().slice(1, -1);

        let exportedProperties: [string, string][] | undefined;
        if (node.exportClause) {
            exportedProperties = node.exportClause.elements.map((decl): [string, string] => {
                // export { <exportedName> } from <modulePath>
                // export { <exportedName> as <exportedAs> } from <modulePath>
                let exportedAs = decl.name.getText();
                let exportedName = decl.propertyName ? decl.propertyName.getText() : exportedAs;
                return [exportedName, exportedAs];
            });
        }

        const output = context.custom.addExportModule(moduleName, exportedProperties);
        if (output) {
            if (typeof output === 'string') {
                context.replace(node.getStart(), node.getEnd(), `import ${output} from ${node.moduleSpecifier.getText()};`);
            } else if (typeof output === 'object') {
                context.replace(node.getStart(), node.getEnd(), output.code);
            }

            return;
        }

        // Remove the export
        context.replace(node.getStart(), node.getEnd(), '');
    }
};

export default impl;
