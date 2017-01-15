const fs = require('fs');
const assert = require('assert');
const tsPack = require('../lib/index');

const COMPILER_OPTIONS = {
    jsx: 2,

    packOptions: {
        hash: function (source) {
            if (typeof source === 'string') {
                return source;
            } else {
                const fileName = source.fileName;
                return fileName.slice(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.'));
            }
        },
        mangleId: function (hash, id, mangle) {
            let postfix = '$i$'; // Internal
            if (mangle === 1 || mangle === 2) postfix = '$x$'; // Export
            if (mangle === 3) postfix = '$n$'; // Node

            postfix += hash;

            return id + postfix;
        }
    }
};

const A_OUTPUT = 'var i$x$a = 0;\nfunction $x$a() { return 1; }\nvar o$i$a = { a: { b: 0 } };\no$i$a.a.b;\n';
const B_OUTPUT = 'i$x$a < $x$a();\n'
const C_OUTPUT = 'function fn$x$c() { return fn$x$d(); }\n';
const D_OUTPUT = 'function fn$x$d() { return 4; }\n';
const G_OUTPUT = 'var b$i$g = 2;\nvar $x$g = \'test\';\n';
const J_OUTPUT = 'function Test$i$j() { }\nReact.createElement(Test$i$j, null);\n';

describe('tsPack', function () {
    it('should handle single files', function () {
        return tsPack.compileFile('test/example/a.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, A_OUTPUT);
            });
    });

    it('should handle including files', function () {
        return tsPack.compileFile('test/example/b.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, A_OUTPUT + B_OUTPUT);
            });
    });

    it('should handle circular references (1)', function () {
        return tsPack.compileFile('test/example/c.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, D_OUTPUT + C_OUTPUT);
            });
    });

    it('should handle circular references (2)', function () {
        return tsPack.compileFile('test/example/d.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, C_OUTPUT + D_OUTPUT);
            });
    });

    it('should handle node modules', function () {
        return tsPack.compileFile('test/example/e.ts', COMPILER_OPTIONS)
            .then(output => {
                // console.log(output);
                // assert.equal(output, C_OUTPUT + D_OUTPUT);
            });
    });

    it('should handle exporting blocks and default values', function () {
        return tsPack.compileFile('test/example/g.ts', COMPILER_OPTIONS)
            .then(output => {
                // console.log(output);
                assert.equal(output, G_OUTPUT);
            });
    });

    it('should handle React (jsx/tsx) files', function () {
        return tsPack.compileFile('test/example/j.tsx', COMPILER_OPTIONS)
            .then(output => {
                // console.log(output);
                assert.equal(output, J_OUTPUT);
            });
    });

    it('should handle raw inclusion (not actually importing values)', function () {
        return tsPack.compileFile('test/example/k.ts', COMPILER_OPTIONS)
            .then(output => {
                // console.log(output);
                assert.equal(output, A_OUTPUT);
            });
    });

    it('should not rename object properties', function () {
        return tsPack.compileFile('test/example/l.ts', COMPILER_OPTIONS)
            .then(output => {
                console.log(output);
                // assert.equal(output, A_OUTPUT);
            });
    });

    it('should not handle export all from', function () {
        return tsPack.compileFile('test/example/n.ts', COMPILER_OPTIONS)
            .then(output => {
                console.log(output);
                // assert.equal(output, A_OUTPUT);
            });
    });
});
