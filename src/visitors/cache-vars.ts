import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { addSourceFileIdentifier } from '../util/source-file-ids';

export = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.VariableStatement
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.VariableStatement, context: tspoon.VisitorContext) {
        const exported = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);

        node.declarationList.declarations.forEach(decl => {
            addSourceFileIdentifier(node.getSourceFile(), decl.name.getText(), exported);
        });
    }
} as tspoon.Visitor;
