import * as ts from 'typescript';
import * as tspoon from 'tspoon';
import VISITORS from '../visitors';

const COMPILER_OPTIONS = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES5,
};

const MODULE_HOST = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
};

export function resolveModule(moduleName: string, parentPath?: string): string | undefined {
    if (moduleName[0] !== '.' && moduleName[0] !== '/') return;

    const resolvedModule = ts.resolveModuleName(moduleName, parentPath || '', COMPILER_OPTIONS, MODULE_HOST);
    return resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName;
}

export function transpile(modulePath: string, prevSourceFile?: ts.SourceFile): tspoon.TranspilerOutput {
    const fileContents = ts.sys.readFile(modulePath);
    const config: tspoon.TranspilerConfig = {
        sourceFileName: modulePath,
        compilerOptions: COMPILER_OPTIONS,
        visitors: VISITORS,
        preTranspile: ast => {
            if (prevSourceFile) {
                (ast as any).$imports = (prevSourceFile as any).$imports;
            } else {
                (ast as any).$imports = {};
            }

            (ast as any).$imports[modulePath] = {};
        },
    };

    return tspoon.transpile(fileContents, config);
}
