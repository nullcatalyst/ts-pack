import * as path from 'path';
import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { resolveModule, transpile } from './util/transpile';

const SRC_FILE = './demo/one';
// const SRC_FILE = './src/main';

const resolvedModulePath = resolveModule(path.resolve(SRC_FILE));
const output = transpile(resolvedModulePath);

console.log(output.code);

process.exit(0);
