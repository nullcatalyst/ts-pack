const fs = require('fs');
const assert = require('assert');
const tsPack = require('../lib/index');

const COMPILER_OPTIONS = {
    mangleId: function (fileName, id, mangle) {
        let prefix = '_';
        if (mangle === 'export' || mangle === 'default') prefix = 'export_';
        if (mangle === 'node') prefix = 'node_';

        let postfix = '_' + fileName;
        if (mangle !== 'node') postfix = '_' + fileName.slice(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.'));

        return prefix + id + postfix;
    }
};

const HELPERS_OUTPUT = fs.readFileSync('src/helpers.js', 'utf8');

const A_OUTPUT = 'var export_i_a = 0;\nfunction export__a() { return 1; }\nvar _o_a = { a: { b: 0 } };\n_o_a.a.b;\n';
const B_OUTPUT = 'export_i_a < export__a();\n'
const C_OUTPUT = 'function export_fn_c() { return export_fn_d(); }\n';
const D_OUTPUT = 'function export_fn_d() { return 4; }\n';

describe('tsPack', function () {
    it('should handle single files', function () {
        return tsPack.compileFile('test/example/a.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, HELPERS_OUTPUT + A_OUTPUT);
            });
    });

    it('should handle including files', function () {
        return tsPack.compileFile('test/example/b.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, HELPERS_OUTPUT + A_OUTPUT + B_OUTPUT);
            });
    });

    it('should handle circular references (1)', function () {
        return tsPack.compileFile('test/example/c.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, HELPERS_OUTPUT + D_OUTPUT + C_OUTPUT);
            });
    });

    it('should handle circular references (2)', function () {
        return tsPack.compileFile('test/example/d.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, HELPERS_OUTPUT + C_OUTPUT + D_OUTPUT);
            });
    });

    it('should handle node modules', function () {
        return tsPack.compileFile('test/example/e.ts', COMPILER_OPTIONS)
            .then(output => {
                // console.log(output);
                // assert.equal(output, C_OUTPUT + D_OUTPUT);
            });
    });
});
