import * as ts from 'typescript';
import * as tspoon from 'tspoon';

const SRC = `
import * as fs from 'fs';
export const s = { hello: "world" }, z = 0;
const r = 1;
function test1() { return test2(); }
function test2() { const r = 4; return r; }
`;

let config: tspoon.TranspilerConfig = {
    sourceFileName: 'test.ts',
    compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES5,
    },
    visitors: [
        // require('./visitors/load-imports'),
        require('./visitors/cache-vars'),
        require('./visitors/cache-funcs'),
        require('./visitors/change-ids'),
        require('./visitors/remove-export'),
    ],
};

let transpilerOut = tspoon.transpile(SRC, config);
console.log(transpilerOut.code);

process.exit(0);
