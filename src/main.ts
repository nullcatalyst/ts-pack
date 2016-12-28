import * as ts from 'typescript';
import * as tspoon from 'tspoon';

const SRC =
`
export const s = { hello: "world" }, z = 0;
const one = 1;
function test() { return null; }
function test() { const r = 4; return r; }
`;

const changeVarNames: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        // if (node.kind === ts.SyntaxKind.SourceFile) console.log('source file', node);
        return node.kind === ts.SyntaxKind.VariableStatement;
    },
    visit: function visit(node: ts.VariableStatement, context: tspoon.VisitorContext) {
        const isExported = node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
        const fileName = context.fileName;
        const prefix = isExported ? '' : '__';
        const postfix = '__' + fileName.substr(0, fileName.lastIndexOf('.')).replace(/[^a-z0-9]/gmi, '_');

        let sourceFile = node.getSourceFile();

        // Change the variable name
        node.declarationList.declarations.forEach(decl => {
            console.log('decl:', decl);
            // (sourceFile as any).identifiers[decl.name.getText()] = prefix + decl.name.getText() + postfix;
            // (sourceFile as any).identifiers[decl.name.getText()] = prefix + decl.name.getText() + postfix;

            // console.log((sourceFile as any).identifiers);
            // context.replace(decl.name.getStart(), decl.name.getEnd(), prefix + decl.name.getText() + postfix);
        });
    }
};

const changeFnNames: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ExportKeyword;
    },
    visit: function visit(node: ts.Node, context: tspoon.VisitorContext) {
        // Remove the export keyword
        context.replace(node.getStart(), node.getEnd(), '');
    }
};

const removeExport: tspoon.Visitor = {
    filter: function filter(node: ts.Node) {
        return node.kind === ts.SyntaxKind.ExportKeyword;
    },
    visit: function visit(node: ts.Node, context: tspoon.VisitorContext) {
        // Remove the export keyword
        context.replace(node.getStart(), node.getEnd(), '');
    }
};

let config: tspoon.TranspilerConfig = {
    sourceFileName: 'test.ts',
    visitors: [ changeVarNames, removeExport ],
};

let transpilerOut = tspoon.transpile(SRC, config);

console.log(transpilerOut.code);

process.exit(0);
