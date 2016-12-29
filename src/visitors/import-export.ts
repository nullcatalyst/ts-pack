import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { addSourceFileImport } from '../util/source-file';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ExportDeclaration;
    },
    visit: function visit(node: ts.ExportDeclaration, context: tspoon.VisitorContext) {
        console.log('node:', node);

        // This is the module to be loaded, after removing the quotes
        let moduleName = node.moduleSpecifier.getText().slice(1, -1);

        const output = addSourceFileImport(node.getSourceFile(), moduleName, undefined, true);
        if (output) {
            context.replace(node.getStart(), node.getEnd(), output.code);
            return;
        }
    }
} as tspoon.Visitor;
