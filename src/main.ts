import * as fs from 'fs';
import * as path from 'path';
import * as Promise from 'bluebird';
import * as ts from 'typescript';
import * as Getopt from 'node-getopt';
import * as tsPack from './index';

const opt = new Getopt([
        ['h', 'help',        'Print this message.'],
        ['o', 'outFile=ARG', 'The output file. Otherwise logs to the console.'],
        ['p', 'project=ARG', 'Compile the project in the given directory.'],
        ['v', 'version',     'Print the compiler\'s version.'],
    ])
    .bindHelp()     // bind option 'help' to default action
    .parseSystem(); // parse command line

if (opt) {
    for (let option in opt.options) {
        switch (option) {
            case 'version':
                displayVersion();
                process.exit(0);
        }
    }

    if (opt.argv.length > 0) {
        let inFile = opt.argv[0];
        let promise: Promise<tsPack.CompilerOptions>;

        // Read the passed in project settings
        let tsconfigPath = opt.options['project'];
        if (tsconfigPath) {
            const stats = fs.lstatSync(tsconfigPath);
            if (stats.isDirectory()) {
                tsconfigPath = path.resolve(tsconfigPath, 'tsconfig.json');
            }

            promise = tsPack.parseConfig(tsconfigPath);
        } else {
            promise = Promise.resolve(undefined);
        }

        promise
            .then((compilerOptions) => {
                return tsPack.compileFile(inFile, compilerOptions)
            })
            .then((output: string) => {
                let outFile = opt.options['outFile'];

                if (!outFile) {
                    // if (inFile.endsWith('.ts')) {
                    //     outFile = inFile.slice(0, -3) + '.js';
                    // } else {
                    //     outFile = inFile + '.js';
                    // }

                    output.split('\n').forEach(line => console.log(line));
                    return;
                }

                fs.writeFileSync(outFile, output, { 'encoding': 'utf8' });
            })
            .catch((error: Error) => {
                console.error(error.message);
            });
    }
}

function displayVersion(): void {
    const _package = require('../package.json');

    console.info(`Version ${_package.version} [using typescript ${ts.version}]`)
}
