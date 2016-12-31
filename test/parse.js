const assert = require('assert');
const tsunami = require('../lib/index');

const COMPILER_OPTIONS = {
    mangleId: function (fileName, id, _export) {
        return (_export ? 'export_' : '_') + id + ('_' + fileName.slice(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.')));
    }
};

const A_OUTPUT = 'var export_i_a = 0;\nfunction export_fn_a() { return 1; }\n';
const B_OUTPUT = 'export_i_a < export_fn_a();\n'
const C_OUTPUT = 'function export_fn_c() { return export_fn_d(); }\n';
const D_OUTPUT = 'function export_fn_d() { return 4; }\n';

describe('tsunami', function () {
    it('should handle single files', function () {
        return tsunami.compileFile('test/example/a.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, A_OUTPUT);
            });
    });

    it('should handle including files', function () {
        return tsunami.compileFile('test/example/b.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, A_OUTPUT + B_OUTPUT);
            });
    });

    it('should handle circular references (1)', function () {
        return tsunami.compileFile('test/example/c.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, D_OUTPUT + C_OUTPUT);
            });
    });

    it('should handle circular references (2)', function () {
        return tsunami.compileFile('test/example/d.ts', COMPILER_OPTIONS)
            .then(output => {
                assert.equal(output, C_OUTPUT + D_OUTPUT);
            });
    });
});
