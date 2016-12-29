import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import resolveModule from './util/resolve-module';
import { Context } from './context';

// const SRC_FILE = './demo/one';
const SRC_FILE = './src/main';
const filePath = path.resolve(SRC_FILE);

console.log(filePath);

const resolvedModulePath = resolveModule(filePath);
const output = Context.transpile(resolvedModulePath);

// console.log(output.code);
fs.writeFileSync(path.resolve('./output.js'), output.code, 'utf-8');

process.exit(0);
