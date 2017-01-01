import * as ts from 'typescript';
import * as builtinModules from 'builtin-modules';

const COMPILER_OPTIONS = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
};

const MODULE_HOST = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
};

export function resolveModule(moduleName: string, parentPath?: string): string | undefined {
    parentPath = parentPath || '';

    const resolvedModule = ts.resolveModuleName(moduleName, parentPath, COMPILER_OPTIONS, MODULE_HOST);
    return resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName;
}

export function isNodeModule(modulePath: string): boolean {
    if (builtinModules.indexOf(modulePath) >= 0) {
        return true;
    } else {
        return modulePath.indexOf('/node_modules/') >= 0;
    }
}
