import * as ts from 'typescript';

export type CompilerOptions = ts.CompilerOptions & AdditionalCompilerOptions;

export type MangleType = 'private' | 'export' | 'node' | 'default';

export enum Mangle {
    Private,
    Public,
    Default,
    Node,
};

export interface AdditionalCompilerOptions {
    emitCustomHelpers?: boolean;

    mangleId?(fileName: string, id: string, mangle: MangleType): string;
}
