import * as path from 'path';
import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { resolveModule, transpile } from './util/transpile';

const resolvedModulePath = resolveModule(path.resolve('./demo/one'));
const output = transpile(resolvedModulePath);

console.log(output.code);

process.exit(0);
