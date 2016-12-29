import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { transpile } from '../util/transpile';
import { addImportFile } from '../util/source-file';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ImportDeclaration
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.ImportDeclaration, context: tspoon.VisitorContext) {
        // This is the module to be loaded, after removing the quotes
        let moduleName = node.moduleSpecifier.getText().slice(1, -1);

        if (node.importClause.namedBindings.kind === ts.SyntaxKind.NamespaceImport) {
            // import * as <importedAs> from <modulePath>
            let importedAs = node.importClause.namedBindings.name.getText();

            const output = addImportFile(node.getSourceFile(), moduleName, importedAs);
            if (output) {
                context.replace(node.getStart(), node.getEnd(), output.code);
                return;
            }
        } else if (node.importClause.namedBindings.kind === ts.SyntaxKind.NamedImports) {
            const importedProperties = node.importClause.namedBindings.elements.map((decl): [string, string] => {
                // import { <importedName> } from <modulePath>
                // import { <importedName> as <importedAs> } from <modulePath>
                let importedAs = decl.name.getText();
                let importedName = decl.propertyName ? decl.propertyName.getText() : importedAs;
                return [importedName, importedAs];
            });

            const output = addImportFile(node.getSourceFile(), moduleName, importedProperties);
            if (output) {
                context.replace(node.getStart(), node.getEnd(), output.code);
                return;
            }
        }

        // Remove the import
        context.replace(node.getStart(), node.getEnd(), '');
    }
} as tspoon.Visitor;
