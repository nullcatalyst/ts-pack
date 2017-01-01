import * as fs from 'fs';
import * as path from 'path';
import * as Promise from 'bluebird';
import * as ts from 'typescript';
import * as Getopt from 'node-getopt';
import * as tsPack from 'index';

const opt = new Getopt([
        ['h', 'help',        'Print this message.'],
        ['o', 'outFile=ARG', 'The output file.'],
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

        let compilerOptions: any;
        let tsconfig = opt.options['project'];
        if (tsconfig) {
            const stats = fs.lstatSync(tsconfig);
            if (stats.isDirectory()) {
                tsconfig = path.resolve(tsconfig, 'tsconfig.json');
            }

            const tsconfigJson = require(tsconfig);
            compilerOptions = tsconfigJson['compilerOptions'];

            // if (tsconfigJson['compilerOptions']['baseUrl']) {
            //     tsconfigJson['compilerOptions']['baseUrl'] = path.resolve(path.dirname(tsconfig), tsconfigJson['compilerOptions']['baseUrl']);
            // }
        }

        tsPack.compileFile(inFile, compilerOptions)
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
