import * as fs from 'fs';
import * as path from 'path';
import * as Promise from 'bluebird';
import * as ts from 'typescript';
import * as tspoon from './tspoon';
import { CompilerOptions } from './util/compiler-options';
import { Context } from './context';

export { CompilerOptions } from './util/compiler-options';

const lstat = Promise.promisify<fs.Stats, string>(fs.lstat);
const readFile = Promise.promisify<string, string, string>(fs.readFile);

const PARSE_CONFIG: ts.ParseConfigHost = {
    useCaseSensitiveFileNames: false,
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
};

export function parseConfig(fileName: string): Promise<CompilerOptions> {
    return readFile(fileName, 'utf8')
        .then((jsonText) => {
            const result = ts.parseConfigFileTextToJson(fileName, jsonText);

            if (result.error) {
                throw result.error;
            } else {
                const tsconfig = ts.parseJsonConfigFileContent(result.config, PARSE_CONFIG, path.dirname(fileName));
                const options: CompilerOptions = tsconfig.options;

                // In order to prevent the typescript compiler outputting the helper functions multiple times,
                // we tell the compiler not to emit the helpers, and we will include them ourselves.
                options.noEmitHelpers = true;

                return options;
            }
        });
}

export function compileFile(fileName: string, options?: CompilerOptions): Promise<string> {
    // Use the default options if none were supplied
    options = options || {};

    const filePath = path.resolve(fileName);
    return lstat(filePath)
        .then((stats: fs.Stats) => {
            if (!stats.isFile()) {
                throw new Error(`Could not read from file "${filePath}"`);
            }
        })
        .then(() => {
            // if (emitHelpers) {
                return readFile(path.resolve(__dirname, 'helpers.js'), 'utf8');
            // } else {
            //     return '';
            // }
        })
        .then((helpers) => {
            const output = Context.transpile(options, filePath);
            return helpers + output.code;
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
