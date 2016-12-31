import * as ts from 'typescript';
import * as tspoon from '../tspoon';
import { VisitorContext, Context } from '../context';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ImportDeclaration
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.ImportDeclaration, context: VisitorContext) {
        // This is the module to be loaded, after removing the quotes
        let moduleName = node.moduleSpecifier.getText().slice(1, -1);

        if (node.importClause) {
            if (node.importClause.name) {
                // import <importedName> from <modulePath>
                let importedAs = node.importClause.name.getText();

                const output = context.custom.addImport(moduleName, importedAs, true);
                if (output) {
                    context.replace(node.getStart(), node.getEnd(), output.code);
                    return;
                }
            }

            if (node.importClause.namedBindings) {
                if (node.importClause.namedBindings.kind === ts.SyntaxKind.NamespaceImport) {
                    // import * as <importedAs> from <modulePath>
                    let importedAs = node.importClause.namedBindings.name.getText();

                    const output = context.custom.addImport(moduleName, importedAs, false);
                    if (output !== undefined) {
                        if (output) {
                            context.replace(node.getStart(), node.getEnd(), output.code);
                        }
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

                    const output = context.custom.addImport(moduleName, importedProperties, false);
                    if (output !== undefined) {
                        if (output) {
                            context.replace(node.getStart(), node.getEnd(), output.code);
                        }
                        return;
                    }
                }
            }
        }

        // Remove the import
        context.replace(node.getStart(), node.getEnd(), '');
    }
};

export default impl;
