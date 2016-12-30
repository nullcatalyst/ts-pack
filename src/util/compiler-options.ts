import * as ts from 'typescript';

export type CompilerOptions = ts.CompilerOptions & AdditionalCompilerOptions;

export interface AdditionalCompilerOptions {
    mangleId?(fileName: string, id: string, _export: boolean): string
}
