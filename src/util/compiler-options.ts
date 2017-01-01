import * as ts from 'typescript';

export type CompilerOptions = ts.CompilerOptions & AdditionalCompilerOptions;

export type MangleType = 'private' | 'export' | 'node' | 'default';

export interface AdditionalCompilerOptions {
    mangleId?(fileName: string, id: string, mangle: MangleType): string
}
