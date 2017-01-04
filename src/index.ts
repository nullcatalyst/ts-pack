import * as fs from 'fs';
import * as path from 'path';
import * as Promise from 'bluebird';
import * as ts from 'typescript';
import * as tspoon from './tspoon';
import { CompilerOptions, setDefaultOptions } from './util/compiler-options';
import { Context } from './context';

export { CompilerOptions } from './util/compiler-options';

const lstat = Promise.promisify<fs.Stats, string>(fs.lstat);
const readFile = Promise.promisify<string, string, string>(fs.readFile);
const HELPERS_FILE = path.resolve(__dirname, 'helpers.js');
const OUTPUT_TOKEN = '%output%';

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
                return setDefaultOptions(tsconfig.options, tsconfig.raw.packOptions);
            }
        });
}

function handleTranspile(options: CompilerOptions, handler: (helpers: string) => string) {
    return function () {
        return Promise.resolve()
            .then(() => {
                if (options.packOptions.emitCustomHelpers) {
                    return readFile(HELPERS_FILE, 'utf8');
                } else {
                    return '';
                }
            })
            .then(handler)
            .then(output => {
                const wrapOutput = options.packOptions.wrapOutput;
                if (wrapOutput) {
                    let index = wrapOutput.indexOf(OUTPUT_TOKEN);
                    output = wrapOutput.substring(0, index) + output + wrapOutput.substring(index + OUTPUT_TOKEN.length);
                }

                return output;
            });
    }
}

export function compileFile(fileName: string, options?: CompilerOptions): Promise<string> {
    // Use the default options if none were supplied
    options = setDefaultOptions(options);
    const filePath = path.resolve(fileName);

    return lstat(filePath)
        .then((stats: fs.Stats) => {
            if (!stats.isFile()) {
                throw new Error(`Could not read from file "${filePath}"`);
            }
        })
        .then(handleTranspile(options, (helpers: string): string => {
            const output = Context.transpileFile(options, filePath);
            return helpers + output.code;
        }));
}

export function compile(fileName: string, contents: string, options?: CompilerOptions): Promise<string> {
    // Use the default options if none were supplied
    options = setDefaultOptions(options);
    fileName = path.resolve(fileName);

    return Promise.resolve()
        .then(handleTranspile(options, (helpers: string): string => {
            const output = Context.transpileFile(options, fileName);
            return helpers + output.code;
        }));
}
