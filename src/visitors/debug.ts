import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { getSyntaxKindName } from '../util/syntax-kind';

const impl: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        // Print the start of a file
        if (node.kind === ts.SyntaxKind.SourceFile) {
            console.log('--------', node.getSourceFile().fileName, '--------');
        }

        // Print the name of the node kind
        console.log(getSyntaxKindName(node.kind));

        return false;
    },
    visit: function visit(node: ts.FunctionDeclaration, context: tspoon.VisitorContext) {
        
    }
};

export default impl;
