const fs = require('fs');
const assert = require('assert');
const tsPack = require('../lib/index');

const COMPILER_OPTIONS = {
    jsx: 2,

    packOptions: {
        mangleId: function (fileName, id, mangle) {
            let prefix = 'i_';
            if (mangle === 1 || mangle === 2) prefix = 'x_';
            if (mangle === 3) prefix = 'n_';

            let postfix = '_' + fileName;
            if (mangle !== 3) postfix = '_' + fileName.slice(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.'));

            if (id && id[0] === id[0].toUpperCase()) {
                prefix = prefix.toUpperCase();
            }

            return prefix + id + postfix;
        }
    }
};

const A_OUTPUT = 'var x_i_a = 0;\nfunction x__a() { return 1; }\nvar i_o_a = { a: { b: 0 } };\ni_o_a.a.b;\n';
const B_OUTPUT = 'x_i_a < x__a();\n'
const C_OUTPUT = 'function x_fn_c() { return x_fn_d(); }\n';
const D_OUTPUT = 'function x_fn_d() { return 4; }\n';
const G_OUTPUT = 'var i_b_g = 2;\nvar x__g = \'test\';\n';
const J_OUTPUT = 'function I_Test_j() { }\nReact.createElement(I_Test_j, null);\n';

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
});
