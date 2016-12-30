import * as fs from 'fs';
import * as path from 'path';
import * as Promise from 'bluebird';
import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import { resolveModule } from './util/resolve-module';
import { CompilerOptions } from './util/compiler-options';
import { Context } from './context';

const fileExists = Promise.promisify(fs.exists);
const readFile = Promise.promisify(fs.readFile);

export function compileProject(project: string): Promise<string>;
export function compileProject(options: CompilerOptions): Promise<string>;
export function compileProject(options: string | CompilerOptions): Promise<string> {
    if (typeof options === 'string') {

    } else {
        return new Promise<string>((resolve, reject) => {

        });
    }
};

export function compileFile(fileName: string, options?: CompilerOptions): Promise<string> {
    // Use the default options if none were supplied
    options = options || {};

    const filePath = path.resolve(fileName);

    return fileExists(filePath)
        .then((exists: boolean) => {
            if (exists) {
                const output = Context.transpile(options, filePath);
                return output.code;
            } else {
                throw new Error(`File "${filePath}" not found`);
            }
        });
}
