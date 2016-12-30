import * as fs from 'fs';
import * as Promise from 'bluebird';
import Getopt = require('node-getopt');
const tsunami = require('./index');

const writeFile = Promise.promisify(fs.writeFile);

const opt = new Getopt([
        ['h', 'help',        'Print this message.'],
        ['o', 'outFile=ARG', 'The output file.'],
        ['p', 'project=ARG', 'Compile the project in the given directory.'],
        ['v', 'version',     'Print the compiler\'s version.'],
    ])
    .bindHelp()     // bind option 'help' to default action
    .parseSystem(); // parse command line

for (let option in opt.options) {
    switch (option) {
        case 'version':
            displayVersion();
            process.exit(0);
    }
}

if (opt.argv.length > 0) {
    tsunami.compileFile(opt.argv[0])
        .then((output: string) => {
            if (opt.options['outFile']) {
                fs.writeFileSync(opt.options['outFile'], output, { 'encoding': 'utf8' });
            } else {
                // console.log(output)

                // console.log appears to stop printing long strings after a certain amount of characters
                // so split the output and print line by line
                for (let line of output.split('\n')) {
                    console.log(line);
                }
            }
        })
        .catch((error: Error) => {
            console.error(error.message);
        });
}

function displayVersion(): void {
    const ts = require('typescript');
    const _package = require('../package.json');

    console.info(`Version ${_package.version} [using typescript ${ts.version}]`)
}
