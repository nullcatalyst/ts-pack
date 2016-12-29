import * as ts from 'typescript';
import * as tspoon from 'tspoon';

const COMPILER_OPTIONS = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
};

const VISITORS = [
    require('../visitors/load-imports'),
    require('../visitors/import-export'),
    require('../visitors/cache-vars'),
    require('../visitors/cache-funcs'),
    require('../visitors/change-import-props'),
    require('../visitors/change-ids'),
    require('../visitors/remove-export'),
];

const MODULE_HOST = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
};

export function resolveModule(moduleName: string, parentPath?: string): string | undefined {
    const resolvedModule = ts.resolveModuleName(moduleName, parentPath || '', COMPILER_OPTIONS, MODULE_HOST);
    return resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName;
}

export function transpile(modulePath: string): tspoon.TranspilerOutput {
    const fileContents = ts.sys.readFile(modulePath);
    const config: tspoon.TranspilerConfig = {
        sourceFileName: modulePath,
        compilerOptions: COMPILER_OPTIONS,
        visitors: VISITORS,
    };

    return tspoon.transpile(fileContents, config);
}
