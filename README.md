# ts-pack

[![npm][npm]][npm-url]

Inspired by [webpack](https://github.com/webpack/webpack), this is an attempt at duplicating the basic functionality of merging source files into one output file.
The goal is to merge all source files without the overhead of the the module functions and the array containing the exports.
File size and initial start-up time, especially for projects using many small modules, should benefit the most from using a packer like this.

This project uses [typescript](https://github.com/microsoft/typescript) to parse files into an abstract syntax tree, which is then modified using [tspoon](https://github.com/wix/tspoon) to produce a single output with the variables from each module (exported and internal) renamed to coexist in a single scope.
The output should then be run through a javascript minifier like [uglify](https://github.com/mishoo/UglifyJS2) to produce the final result.

## Usage

``` javascript
import * as tsPack from 'ts-pack';

let promise = tsPack.compileFile(
    inFile,         // the input file name, as string
    compilerOptions // (optional) the compiler options, as seen in a tsconfig.json file
);

// Alternatively
let promise = tsPack.compile(
    inFile,         // the input file name, as string
    contents,       // the contents of the input file name, as string
    compilerOptions // (optional) the compiler options, as seen in a tsconfig.json file
);

promise.then((output /* as string */) => {
    // Do something with the output
    // Maybe write it to a file or something
});
```

## Command Line Interface

``` bash
# Typical usage:
tspack <input> [-o <output>] [-p <path to tsconfig.json file>]
# When a tsconfig file is given, the compilerOptions from it are used to compile the input file

# As well as the usual:
tspack --help    # Open the help; -h also works
tspack --version # Output the current version, including the version of the included typescript
```

## Additional `tsconfig.json` File Options

This project supports adding additional options into the tsconfig file passed to it.

``` javascript
{
    "compilerOptions": { ... },

    /**
     * This object contains all of the additional options that are used by this transpiler.
     */
    "packOptions": {
        /**
         * Typescript emits its special handler functions once per input file that uses them.
         * setting this to `true` will enable outputting a single custom version of the handlers
         * at the top of the file.
         *
         * @default false
         */
        "emitCustomHandlers": false,

        /**
         * Provides an easy way to wrap the entire output in a immediately-invoked function expression (IIFE).
         * This typically allows the minifier to do a better job.
         * This can be any string, where the substring '%output%' is replaced with the transpiled file contents.
         *
         * @default "%output%"
         */
        "wrapOutput": "(function(){%output%})();",

        /**
         * Provides a way to explicitly exclude imports from the transpilation process.
         * Any import found in this list will stay treated as a regular `require()`.
         *
         * @default []
         */
        "excludeImports": [
            "bluebird",
            "lodash",
            ...
        ]
    }
}
```

## Some notable caveats

1. It does not support importing via the `require()` function. Any call to `require()` will stay as such, and will not get merged. *This may be changed at a later date.*
2. Currently, it only supports merging files that are **not** found in the `node_modules` folder. This is to avoid trying to merge native/C++ modules. This should not be an issue for the most part, but does mean that it is not possible to include node_modules libraries inline. I am working on a way to configure which libraries should be included or excluded, in much the same way as webpack. This will most likely involve adding additional fields to the tsconfig file.
3. *Caveat emptor.* This is probably not production ready. Use at your own risk. I suggest thoroughly testing the output if you plan on using this in your own projects.

[npm]: https://img.shields.io/npm/v/ts-pack.svg
[npm-url]: https://npmjs.com/package/ts-pack
