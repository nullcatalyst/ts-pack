import * as ts from 'typescript';
import * as tspoon from 'tspoon';

function getSyntaxKindName(syntaxKind: ts.SyntaxKind): string | undefined {
    for (let property in ts.SyntaxKind) {
        if (ts.SyntaxKind[property] as any === syntaxKind) {
            return property;
        }
    }
}

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        // Print the start of a file
        if (node.kind === ts.SyntaxKind.SourceFile) {
            console.log('--------', node.getSourceFile().fileName, '--------');
        }

        // Print the name of the node kind
        if (node.kind === ts.SyntaxKind.Identifier) {
            console.log(getSyntaxKindName(node.kind), '-', node.getText());
        } else {
            console.log(getSyntaxKindName(node.kind));
        }

        return false;
    },
    visit: function visit(node: ts.FunctionDeclaration, context: tspoon.VisitorContext) {
        
    }
};

export default impl;
