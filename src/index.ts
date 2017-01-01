import * as fs from 'fs';
import * as path from 'path';
import * as Promise from 'bluebird';
import * as ts from 'typescript';
import * as tspoon from './tspoon';
import { resolveModule } from './util/resolve-module';
import { CompilerOptions } from './util/compiler-options';
import { Context } from './context';

export { CompilerOptions } from './util/compiler-options';

const fileStats = Promise.promisify<fs.Stats, string>(fs.lstat);

export function compileFile(fileName: string, options?: CompilerOptions): Promise<string> {
    // Use the default options if none were supplied
    options = options || {};

    const filePath = path.resolve(fileName);

    return fileStats(filePath)
        .then((stats: fs.Stats) => {
            if (stats.isFile()) {
                const output = Context.transpile(options, filePath);
                return output.code;
            } else {
                throw new Error(`File "${filePath}" not found`);
            }
        });
}

export function compile(fileName: string, contents: string, options?: CompilerOptions): Promise<string> {
    // Use the default options if none were supplied
    options = options || {};

    fileName = path.resolve(fileName);
    return new Promise<string>((resolve, reject) => {
            try {
                const output = Context.transpile(options, fileName);
                resolve(output.code);
            } catch (error) {
                reject(error);
            }
        });
}
