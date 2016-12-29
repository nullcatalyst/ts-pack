import * as ts from 'typescript';

const COMPILER_OPTIONS = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
};

const MODULE_HOST = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
};

export default function resolveModule(moduleName: string, parentPath?: string): string | undefined {
    if (moduleName[0] !== '.' && moduleName[0] !== '/') return;

    parentPath = parentPath || '';

    const resolvedModule = ts.resolveModuleName(moduleName, parentPath, COMPILER_OPTIONS, MODULE_HOST);
    return resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName;
}
