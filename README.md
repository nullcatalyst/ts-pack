# ts-pack

Inspired by [webpack](https://github.com/webpack/webpack), this is an attempt at duplicating the basic functionality of merging source files into one output file.
The goal is to merge all source files without the overhead of the the module functions and the array containing the exports.
Initial start-up time, especially projects using many small modules, should benefit the most from using a packer like this.

This project uses [typescript](https://github.com/microsoft/typescript) to parse files into an abstract syntax tree, which is then modified using [tspoon](https://github.com/wix/tspoon) to produce a single output with the variables from each module (exported and internal) renamed to coexist in a single scope.
The output should then be run through a javascript minifier like [uglify](https://github.com/mishoo/UglifyJS2) to produce the final result.

**Some notable caveats:**

1. It does not support importing via the `require()` function. Any call to `require()` will stay as such, and will not get merged. *This may be changed at a later date.*
2. Currently, it only supports merging files that are imported using relative paths. In other words, imports starting with `./` or `../`. This should not be an issue for the most part, but does mean that it is not possible to include node_modules libraries inline. I am working on a way to configure which libraries should be included or excluded, in much the same way as webpack.
3. *Caveat emptor.* This is probably not production ready. Use at your own risk. I suggest thoroughly testing the output if you plan on using this in your own projects.
