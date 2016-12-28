import * as ts from 'typescript';
import * as tspoon from 'tspoon';

export = {
    filter: function filter(node: ts.Node) {
        console.log('node.kind:', node.kind);
        return node.kind === ts.SyntaxKind.ImportDeclaration
            && node.parent.kind === ts.SyntaxKind.SourceFile;
    },
    visit: function visit(node: ts.VariableStatement, context: tspoon.VisitorContext) {
        
    }
} as tspoon.Visitor;
