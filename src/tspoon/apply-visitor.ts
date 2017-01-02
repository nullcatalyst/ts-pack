import * as ts from 'typescript';
import { defaultCompilerOptions } from '../tspoon/configuration';
import { traverseAst } from '../tspoon/traverse-ast';
import { Visitor } from '../tspoon/visitor';
import { Action, MutableSourceCode } from '../tspoon/mutable-source-code';
import { TranspilerContext } from '../tspoon/transpiler-context';
import { SemanticHost } from '../tspoon/chainable-hosts';
import { VisitorBasedTransformer, CodeTransformer } from '../tspoon/transformer';

export interface ApplyVisitorResult {
    file: ts.SourceFile,
    code: string;
    actions: Action[];
    diags: ts.Diagnostic[];
}

export function applyVisitor(source: string, visitor: Visitor): ApplyVisitorResult {

    const ast = ts.createSourceFile('test.ts', source, defaultCompilerOptions.target, true);
    return applyVisitorOnAst(ast, visitor);
}

export function applyVisitorOnHostedSource(file: string, visitors: Visitor[], host: ts.CompilerHost): string {
    const langService = host instanceof SemanticHost ? ts.createLanguageService(host, ts.createDocumentRegistry()) : null;
    const transformer: CodeTransformer = new VisitorBasedTransformer(visitors, () => langService);
    const ast: ts.SourceFile = host.getSourceFile(file, defaultCompilerOptions.target);
    if (ast) {
        const mutableSourceCode: MutableSourceCode = transformer.transform(ast);
        return mutableSourceCode.code;
    } else {
        return null;
    }
}

export function applyVisitorOnAst(ast: ts.SourceFile, visitor: Visitor): ApplyVisitorResult {

    let context: TranspilerContext = new TranspilerContext(ast.fileName);

    traverseAst(ast, visitor, context);

    const mapper = new MutableSourceCode(ast);
    mapper.execute(context.actions);

    return {
        code: mapper.code,
        actions: context.actions,
        diags: context.diags,
        file: ast.getSourceFile()
    };
}



