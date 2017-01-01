"use strict";
var node$$fs = require("fs");
var node$$path = require("path");
var node$$_Users_scott_ts_pack_node_modules__types_bluebird_index_d = require("bluebird");
var node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d = require("typescript");
var node$$_Users_scott_ts_pack_node_modules_node_getopt_index = require("node-getopt");
"use strict";
var node$$node_modules__types_source_map_index_d = require("source-map");
class pblc$HostBase$src_tspoon_hosts_base {
    // Most likely to be overridded
    fileExists(fileName) {
        return false;
    }
    directoryExists(directoryName) {
        return false;
    }
    readFile(fileName) {
        return null;
    }
    getSourceFile(fileName, languageVersion, onError) {
        return null;
    }
    writeFile(name, text, writeByteOrderMark) {
    }
    useCaseSensitiveFileNames() {
        return false;
    }
    getCanonicalFileName(fileName) {
        return fileName;
    }
    getCurrentDirectory() {
        return '';
    }
    getNewLine() {
        return '\n';
    }
    getDefaultLibFileName(options) {
        return 'lib.d.ts';
    }
    getCancellationToken() {
        return null;
    }
    getDirectories(path) {
        return [];
    }
}
class pblc$ChainableHost$src_tspoon_hosts_base extends pblc$HostBase$src_tspoon_hosts_base {
    constructor() {
        super(...arguments);
        this.source = null;
    }
    setSource(source) {
        if (this.source === null) {
            this.source = source;
        }
        else {
            throw new Error(`A chainable host can be connected to a source only once. It looks like you're trying to include the same instance in multiple chains.`);
        }
    }
    fileExists(fileName) {
        return this.source.fileExists(fileName);
    }
    directoryExists(directoryName) {
        return this.source.directoryExists(directoryName);
    }
    getCurrentDirectory() {
        return this.source.getCurrentDirectory();
    }
    readFile(fileName) {
        return this.source.readFile(fileName);
    }
    getSourceFile(fileName, languageVersion, onError) {
        return this.source.getSourceFile(fileName, languageVersion, onError);
    }
    writeFile(name, text, writeByteOrderMark) {
        this.source.writeFile(name, text, writeByteOrderMark);
    }
    getDirectories(path) {
        return this.source.getDirectories(path);
    }
}
function pblc$chainHosts$src_tspoon_hosts_base(host0, ...chainableHosts) {
    return chainableHosts.reduce((acc, chainableHost) => {
        chainableHost.setSource(acc);
        return chainableHost;
    }, host0);
}
//# sourceMappingURL=hosts-base.js.map
"use strict";
var node$$node_modules_magic_string_dist_magic_string_cjs = require("magic-string");
function prvt$descend$src_tspoon_traverse_ast(node, context) {
    return function visit(...visitors) {
        visitors.forEach(visitor => {
            pblc$traverseAst$src_tspoon_traverse_ast(node, visitor, context);
        });
    };
}
function pblc$traverseAst$src_tspoon_traverse_ast(root, visitor, context) {
    function traverse(node) {
        if (visitor.filter(node)) {
            visitor.visit(node, context, prvt$descend$src_tspoon_traverse_ast(node, context));
            return context.halted || node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.forEachChild(node, traverse);
        }
        return node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.forEachChild(node, traverse);
    }
    return traverse(root);
}
//# sourceMappingURL=traverse-ast.js.map
function pblc$binarySearch$src_tspoon_binary_search(array, value) {
    let low = 0;
    let high = array.length - 1;
    while (low <= high) {
        let middle = low + ((high - low) >> 1);
        let midValue = array[middle];
        if (midValue === value) {
            return middle;
        }
        else if (midValue > value) {
            high = middle - 1;
        }
        else {
            low = middle + 1;
        }
    }
    return low - 1; // the last middle
}
//# sourceMappingURL=binary-search.js.map
class pblc$MappedAction$src_tspoon_mutable_source_code {
}
class pblc$FastAction$src_tspoon_mutable_source_code {
}
class pblc$ReplaceAction$src_tspoon_mutable_source_code extends pblc$MappedAction$src_tspoon_mutable_source_code {
    constructor(start, end, str) {
        super();
        this.start = start;
        this.end = end;
        this.str = str;
    }
    execute(ast, magicString) {
        if (this.start === this.end) {
            magicString.appendLeft(this.start, this.str);
        }
        else {
            magicString.overwrite(this.start, this.end, this.str);
        }
        const textSpan = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createTextSpanFromBounds(this.start, this.end);
        const textChangeRange = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createTextChangeRange(textSpan, this.str.length);
        return ast.update(magicString.toString(), textChangeRange);
    }
    getStart() {
        return this.start;
    }
}
class pblc$InsertAction$src_tspoon_mutable_source_code extends pblc$MappedAction$src_tspoon_mutable_source_code {
    constructor(start, str) {
        super();
        this.start = start;
        this.str = str;
    }
    execute(ast, magicString) {
        magicString.appendLeft(this.start, this.str);
        const textSpan = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createTextSpanFromBounds(this.start, this.start);
        const textChangeRange = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createTextChangeRange(textSpan, this.str.length);
        return ast.update(magicString.toString(), textChangeRange);
    }
    getStart() {
        return this.start;
    }
}
class pblc$FastAppendAction$src_tspoon_mutable_source_code extends pblc$FastAction$src_tspoon_mutable_source_code {
    constructor(str) {
        super();
        this.str = str;
    }
    execute(ast) {
        const start = ast.text.length - 1;
        const textSpan = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createTextSpanFromBounds(start, start);
        const textChangeRange = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createTextChangeRange(textSpan, this.str.length);
        return ast.update(ast.text + this.str, textChangeRange);
    }
}
class pblc$FastRewriteAction$src_tspoon_mutable_source_code extends pblc$FastAction$src_tspoon_mutable_source_code {
    constructor(start, str) {
        super();
        this.start = start;
        this.str = str;
    }
    execute(ast) {
        const textSpan = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createTextSpanFromBounds(this.start, this.start + this.str.length);
        const textChangeRange = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createTextChangeRange(textSpan, this.str.length);
        const newText = ast.text.slice(0, this.start) + this.str + ast.text.slice(this.start + this.str.length);
        return ast.update(newText, textChangeRange);
    }
}
const prvt$compareActions$src_tspoon_mutable_source_code = (action1, action2) => (action2.getStart() - action1.getStart());
class pblc$MutableSourceCode$src_tspoon_mutable_source_code {
    constructor(ast) {
        this._ast = ast;
        this.originalText = ast.text;
        this.origLineStarts = ast.getLineStarts();
    }
    get ast() {
        return this._ast;
    }
    execute(actionList) {
        const fastActions = actionList.filter(action => action instanceof pblc$FastAction$src_tspoon_mutable_source_code);
        fastActions.forEach((action) => {
            this._ast = action.execute(this._ast);
        });
        this.magicString = new node$$node_modules_magic_string_dist_magic_string_cjs(this._ast.text);
        const sortedActions = actionList
            .filter(action => action instanceof pblc$MappedAction$src_tspoon_mutable_source_code)
            .sort(prvt$compareActions$src_tspoon_mutable_source_code);
        sortedActions.forEach((action) => {
            this._ast = action.execute(this._ast, this.magicString);
        });
    }
    get sourceMap() {
        if (!this.magicString) {
            this.magicString = new node$$node_modules_magic_string_dist_magic_string_cjs(this._ast.text);
        }
        if (!this._sourceMap) {
            this._sourceMap = this.magicString.generateMap({ source: this._ast.fileName, hires: true });
        }
        return this._sourceMap;
    }
    get code() {
        return this._ast.text;
    }
    translateMap(from) {
        const originalText = this.originalText;
        const intermediateAst = this._ast;
        const mapConsumer = new node$$node_modules__types_source_map_index_d.SourceMapConsumer(this.sourceMap);
        var fromSMC = new node$$node_modules__types_source_map_index_d.SourceMapConsumer(from);
        var resultMap = new node$$node_modules__types_source_map_index_d.SourceMapGenerator();
        resultMap.setSourceContent(intermediateAst.fileName, originalText);
        fromSMC.eachMapping(mapping => {
            var originalPosition = mapConsumer.originalPositionFor({
                line: mapping.originalLine,
                column: mapping.originalColumn
            });
            if (originalPosition.line != null) {
                resultMap.addMapping({
                    source: intermediateAst.fileName,
                    name: mapping.name,
                    generated: {
                        line: mapping.generatedLine,
                        column: mapping.generatedColumn
                    },
                    original: originalPosition
                });
            }
        });
        this._sourceMap = resultMap.toJSON();
        return resultMap.toJSON();
    }
    translateDiagnostic(diag) {
        const sourceMap = this.sourceMap;
        const cosumer = new node$$node_modules__types_source_map_index_d.SourceMapConsumer(sourceMap);
        const start = diag.file.getLineAndCharacterOfPosition(diag.start);
        const startPos = cosumer.originalPositionFor({
            line: start.line + 1,
            column: start.character
        });
        if (startPos.line === null) {
            return diag;
        }
        else {
            return {
                file: diag.file,
                start: diag.file.getPositionOfLineAndCharacter(startPos.line - 1, startPos.column),
                length: diag.length,
                messageText: diag.messageText,
                category: diag.category,
                code: diag.code
            };
        }
    }
}
//# sourceMappingURL=visitor.js.map
const pblc$defaultCompilerOptions$src_tspoon_configuration = {
    module: node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.ModuleKind.CommonJS,
    jsx: node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.JsxEmit.React,
    target: node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.ScriptTarget.ES5,
    experimentalDecorators: true,
    noEmitHelpers: true,
    sourceMap: true,
    preserveConstEnums: true,
    inlineSources: true,
    emitDecoratorMetadata: false
};
//# sourceMappingURL=configuration.js.map
function prvt$fileExtensionIs$src_tspoon_hosts(path, extension) {
    let pathLen = path.length;
    let extLen = extension.length;
    return pathLen > extLen && path.substr(pathLen - extLen, extLen) === extension;
}
class pblc$MultipleFilesHost$src_tspoon_hosts extends pblc$HostBase$src_tspoon_hosts_base {
    constructor(_resolutionHosts, _compilerOptions = pblc$defaultCompilerOptions$src_tspoon_configuration) {
        super();
        this._resolutionHosts = _resolutionHosts;
        this._compilerOptions = _compilerOptions;
        this.syntacticErrors = [];
    }
    getCurrentDirectory() {
        let currentDir = '';
        this._resolutionHosts.forEach((host) => {
            if (host.getCurrentDirectory) {
                const hostCurrentDir = host.getCurrentDirectory();
                if (hostCurrentDir) {
                    currentDir = hostCurrentDir;
                }
            }
        });
        return currentDir;
    }
    directoryExists(directoryName) {
        return this._resolutionHosts.some(host => host.directoryExists && host.directoryExists(directoryName));
    }
    getDirectories(path) {
        return this._resolutionHosts.reduce((directories, host) => {
            return host.getDirectories ? directories.concat(host.getDirectories(path)) : directories;
        }, []);
    }
    fileExists(fileName) {
        return this._resolutionHosts.some(host => host.fileExists(fileName));
    }
    readFile(fileName) {
        return this._resolutionHosts.reduce((acc, host) => (!acc && host.fileExists(fileName))
            ? host.readFile(fileName)
            : acc, null);
    }
    getSourceFile(fileName) {
        const source = this.readFile(fileName);
        if (source) {
            const ast = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createSourceFile(fileName, source, this._compilerOptions.target, true);
            const syntacticErors = this.getParserErrors(ast);
            if (syntacticErors.length > 0) {
                this.syntacticErrors.push(...syntacticErors);
                return null;
            }
            else {
                return ast;
            }
        }
        else {
            return null;
        }
    }
    getSyntacticErrors() {
        return this.syntacticErrors;
    }
    getParserErrors(sourceFile) {
        // We're accessing here an internal property. It would be more legit to access it through
        // ts.Program.getSyntacticDiagsnostics(), but we want to bail out ASAP.
        return sourceFile['parseDiagnostics'];
    }
}
class pblc$SingleFileHost$src_tspoon_hosts extends pblc$HostBase$src_tspoon_hosts_base {
    constructor(_ast) {
        super();
        this._ast = _ast;
        this._output = '';
        this._map = null;
    }
    get output() {
        return this._output;
    }
    get sourceMap() {
        return JSON.parse(this._map);
    }
    fileExists(fileName) {
        return fileName === this._ast.fileName;
    }
    readFile(fileName) {
        if (fileName === this._ast.fileName) {
            return this._ast.text;
        }
    }
    getSourceFile(fileName) {
        if (fileName === this._ast.fileName) {
            return this._ast;
        }
    }
    writeFile(name, text, writeByteOrderMark) {
        if (prvt$fileExtensionIs$src_tspoon_hosts(name, 'map')) {
            this._map = text;
        }
        else {
            this._output = text;
        }
    }
}
//# sourceMappingURL=hosts.js.map
class pblc$TranspilerContext$src_tspoon_transpiler_context {
    constructor(_fileName, langServiceProvider = null) {
        this._fileName = _fileName;
        this.langServiceProvider = langServiceProvider;
        this._halted = false;
        this._actions = [];
        this._diags = [];
    }
    isHalted() {
        return this._halted;
    }
    insertLine(position, str) {
        this.insert(position, str + '\n');
    }
    insert(position, str) {
        this._actions.push(new pblc$InsertAction$src_tspoon_mutable_source_code(position, str));
    }
    replace(start, end, str) {
        this._actions.push(new pblc$ReplaceAction$src_tspoon_mutable_source_code(start, end, str));
    }
    fastAppend(str) {
        this._actions.push(new pblc$FastAppendAction$src_tspoon_mutable_source_code(str));
    }
    fastRewrite(start, str) {
        this._actions.push(new pblc$FastRewriteAction$src_tspoon_mutable_source_code(start, str));
    }
    reportDiag(node, category, message, halt) {
        let diagnostic = {
            file: node.getSourceFile(),
            start: node.getStart(),
            length: node.getEnd() - node.getStart(),
            messageText: message,
            category: category,
            code: 0
        };
        this._diags.push(diagnostic);
        this._halted = this._halted || halt;
    }
    pushDiag(diagnostic) {
        this._diags.push(diagnostic);
    }
    get actions() {
        return this._actions;
    }
    get diags() {
        return this._diags;
    }
    get halted() {
        return this._halted;
    }
    get fileName() {
        return this._fileName;
    }
    getLanguageService() {
        if (this.langServiceProvider) {
            return this.langServiceProvider();
        }
        else {
            return null;
        }
    }
}
//# sourceMappingURL=transpiler-context.js.map
class pblc$VisitorBasedTransformer$src_tspoon_transformer {
    constructor(visitors, languageServiceProvider) {
        this.visitors = visitors;
        this.languageServiceProvider = languageServiceProvider;
    }
    transform(ast) {
        const context = new pblc$TranspilerContext$src_tspoon_transpiler_context(ast.fileName, this.languageServiceProvider);
        this.visitors.forEach((visitor) => {
            context.halted || pblc$traverseAst$src_tspoon_traverse_ast(ast, visitor, context);
        });
        if (context.halted) {
            return null;
        }
        else {
            const mutable = new pblc$MutableSourceCode$src_tspoon_mutable_source_code(ast);
            mutable.execute(context.actions);
            return mutable;
        }
    }
}
//# sourceMappingURL=transformer.js.map
const prvt$normalizePath$src_tspoon_chainable_hosts = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d['normalizePath'];
const prvt$getDirectoryPath$src_tspoon_chainable_hosts = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d['getDirectoryPath'];
const prvt$combinePaths$src_tspoon_chainable_hosts = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d['combinePaths'];
class pblc$AstCacheHost$src_tspoon_chainable_hosts extends pblc$ChainableHost$src_tspoon_hosts_base {
    constructor() {
        super(...arguments);
        this.cache = {};
    }
    getSourceFile(fileName, languageVersion, onError) {
        const cachedAst = this.cache[fileName];
        if (!cachedAst) {
            const ast = this.source.getSourceFile(fileName, languageVersion, onError);
            this.cache[fileName] = ast;
            return ast;
        }
        else {
            return cachedAst;
        }
    }
}
class pblc$TransformationHost$src_tspoon_chainable_hosts extends pblc$ChainableHost$src_tspoon_hosts_base {
    constructor(visitors, languageServiceProvider = () => null) {
        super();
        this.transformations = {};
        this.transformer = new pblc$VisitorBasedTransformer$src_tspoon_transformer(visitors, languageServiceProvider);
    }
    getSourceFile(fileName, languageVersion, onError) {
        const ast = super.getSourceFile(fileName, languageVersion, onError);
        if (ast) {
            const transformation = this.transformer.transform(ast);
            this.transformations[ast.fileName] = transformation;
            return transformation.ast;
        }
        else {
            return null;
        }
    }
    getSourceMap(fileName) {
        const transformation = this.transformations[fileName];
        if (transformation) {
            return transformation.sourceMap;
        }
        else {
            return null;
        }
    }
    translateDiagnostic(diagnostic) {
        const transformation = this.transformations[diagnostic.file.fileName];
        return transformation ? transformation.translateDiagnostic(diagnostic) : diagnostic;
    }
}
class pblc$SemanticHost$src_tspoon_chainable_hosts extends pblc$ChainableHost$src_tspoon_hosts_base {
    constructor(files, compilerOptions = pblc$defaultCompilerOptions$src_tspoon_configuration, libDir = 'node_modules') {
        super();
        this.files = files;
        this.compilerOptions = compilerOptions;
        this.libDir = libDir;
    }
    getProjectVersion() {
        return null;
    }
    getScriptFileNames() {
        return this.files.slice();
    }
    getScriptVersion(fileName) {
        return null;
    }
    getScriptSnapshot(fileName) {
        return node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.ScriptSnapshot.fromString(this.readFile(fileName));
    }
    getLocalizedDiagnosticMessages() {
        return null;
    }
    getCompilationSettings() {
        return this.compilerOptions;
    }
    log(s) {
    }
    trace(s) {
    }
    error(s) {
    }
    resolveModuleNames(moduleNames, containingFile) {
        return moduleNames.map((moduleName) => {
            return node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.nodeModuleNameResolver(moduleName, containingFile, this.compilerOptions, this).resolvedModule;
        });
    }
    directoryExists(directoryName) {
        return this.source.directoryExists
            ? this.source.directoryExists(directoryName)
            : undefined;
    }
    acquireDocument(fileName, compilationSettings, scriptSnapshot, version) {
        return this.source.getSourceFile(fileName, compilationSettings.target);
    }
    /**
     * Request an updated version of an already existing SourceFile with a given fileName
     * and compilationSettings. The update will in-turn call updateLanguageServiceSourceFile
     * to get an updated SourceFile.
     *
     * @param fileName The name of the file requested
     * @param compilationSettings Some compilation settings like target affects the
     * shape of a the resulting SourceFile. This allows the DocumentRegistry to store
     * multiple copies of the same file for different compilation settings.
     * @param scriptSnapshot Text of the file.
     * @param version Current version of the file.
     */
    updateDocument(fileName, compilationSettings, scriptSnapshot, version) {
        return this.source.getSourceFile(fileName, compilationSettings.target);
    }
    /**
     * Informs the DocumentRegistry that a file is not needed any longer.
     *
     * Note: It is not allowed to call release on a SourceFile that was not acquired from
     * this registry originally.
     *
     * @param fileName The name of the file to be released
     * @param compilationSettings The compilation settings used to acquire the file
     */
    releaseDocument(fileName, compilationSettings) {
    }
    reportStats() {
        return '';
    }
}
function prvt$getParserErrors$src_tspoon_transpile(sourceFile) {
    // We're accessing here an internal property. It would be more legit to access it through
    // ts.Program.getSyntacticDiagsnostics(), but we want to bail out ASAP.
    return sourceFile['parseDiagnostics'];
}
function pblc$transpile$src_tspoon_transpile(content, config) {
    // The context may contain compiler options and a list of visitors.
    // If it doesn't, we use the default as defined in ./configuration.ts
    const compilerOptions = config.compilerOptions || pblc$defaultCompilerOptions$src_tspoon_configuration;
    // First we initialize a SourceFile object with the given source code
    const fileName = config.sourceFileName;
    // Then we let TypeScript parse it into an AST
    const ast = typeof content === 'string'
        ? node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createSourceFile(fileName, content, compilerOptions.target, true)
        : content;
    const parserErrors = prvt$getParserErrors$src_tspoon_transpile(ast);
    if (parserErrors.length > 0) {
        return {
            code: null,
            diags: parserErrors,
            halted: true,
            sourceMap: null
        };
    }
    // The context contains code modifications and diagnostics
    let context = new pblc$TranspilerContext$src_tspoon_transpiler_context(ast.fileName);
    // Call this before running through the list of visitors
    if (config.onBeforeTranspile) {
        config.onBeforeTranspile(ast, context);
    }
    // We execute the various visitors, each traversing the AST and generating
    // lines to be pushed into the code and diagbostic messages.
    // If one of the visitors halts the transilation process we return the halted object.
    config.visitors.some((visitor) => {
        pblc$traverseAst$src_tspoon_traverse_ast(ast, visitor, context);
        return context.halted;
    });
    if (context.halted) {
        return {
            code: null,
            sourceMap: null,
            diags: context.diags,
            halted: true
        };
    }
    // Call this after running through the list of visitors, but before outputting code
    if (config.onAfterTranspile) {
        config.onAfterTranspile(ast, context);
    }
    // Now, we mutate the code with the resulting list of strings to be pushed
    const mutable = new pblc$MutableSourceCode$src_tspoon_mutable_source_code(ast);
    mutable.execute(context.actions);
    // This intermediate code has to be transpiled by TypeScript
    const compilerHost = new pblc$SingleFileHost$src_tspoon_hosts(mutable.ast);
    const program = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createProgram([fileName], compilerOptions, compilerHost);
    const emitResult = program.emit();
    emitResult.diagnostics.forEach((d) => {
        context.pushDiag(mutable.translateDiagnostic(d));
    });
    // If TypeScript did not complete the transpilation, we return the halted object
    if (emitResult.emitSkipped) {
        return {
            code: null,
            sourceMap: null,
            diags: context.diags,
            halted: true
        };
    }
    // If we got here, it means we have final source code to return
    const finalCode = compilerHost.output;
    const intermediateSourceMap = compilerHost.sourceMap;
    // The resulting sourcemap maps the final code to the intermediate code,
    // but we want a sourcemap that maps the final code to the original code,
    // so...
    const finalSourceMap = intermediateSourceMap ? mutable.translateMap(intermediateSourceMap) : null;
    // Now we return the final code and the final sourcemap
    return {
        code: finalCode,
        sourceMap: finalSourceMap,
        diags: context.diags,
        halted: false
    };
}
function pblc$validateAll$src_tspoon_transpile(files, config) {
    let langService;
    const sourceHost = new pblc$MultipleFilesHost$src_tspoon_hosts(config.resolutionHosts, pblc$defaultCompilerOptions$src_tspoon_configuration);
    const astCache = new pblc$AstCacheHost$src_tspoon_chainable_hosts();
    const cachedSource = pblc$chainHosts$src_tspoon_hosts_base(sourceHost, astCache);
    const semanticHost = pblc$chainHosts$src_tspoon_hosts_base(cachedSource, new pblc$SemanticHost$src_tspoon_chainable_hosts(files, pblc$defaultCompilerOptions$src_tspoon_configuration));
    const langServiceProvider = () => {
        return langService
            ? langService
            : langService = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createLanguageService(semanticHost, node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createDocumentRegistry());
    };
    const transformHost = new pblc$TransformationHost$src_tspoon_chainable_hosts(config.mutators || [], langServiceProvider);
    const program = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createProgram(files, pblc$defaultCompilerOptions$src_tspoon_configuration, pblc$chainHosts$src_tspoon_hosts_base(cachedSource, transformHost));
    const diags = [].concat(sourceHost.getSyntacticErrors(), program.getSemanticDiagnostics());
    return diags.map(diagnostic => transformHost.translateDiagnostic(diagnostic));
}
//# sourceMappingURL=transpile.js.map
function pblc$applyVisitor$src_tspoon_apply_visitor(source, visitor) {
    const ast = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createSourceFile('test.ts', source, pblc$defaultCompilerOptions$src_tspoon_configuration.target, true);
    return pblc$applyVisitorOnAst$src_tspoon_apply_visitor(ast, visitor);
}
function pblc$applyVisitorOnHostedSource$src_tspoon_apply_visitor(file, visitors, host) {
    const langService = host instanceof pblc$SemanticHost$src_tspoon_chainable_hosts ? node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createLanguageService(host, node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.createDocumentRegistry()) : null;
    const transformer = new pblc$VisitorBasedTransformer$src_tspoon_transformer(visitors, () => langService);
    const ast = host.getSourceFile(file, pblc$defaultCompilerOptions$src_tspoon_configuration.target);
    if (ast) {
        const mutableSourceCode = transformer.transform(ast);
        return mutableSourceCode.code;
    }
    else {
        return null;
    }
}
function pblc$applyVisitorOnAst$src_tspoon_apply_visitor(ast, visitor) {
    let context = new pblc$TranspilerContext$src_tspoon_transpiler_context(ast.fileName);
    pblc$traverseAst$src_tspoon_traverse_ast(ast, visitor, context);
    const mapper = new pblc$MutableSourceCode$src_tspoon_mutable_source_code(ast);
    mapper.execute(context.actions);
    return {
        code: mapper.code,
        actions: context.actions,
        diags: context.diags,
        file: ast.getSourceFile()
    };
}
//# sourceMappingURL=apply-visitor.js.map
//# sourceMappingURL=index.js.map
"use strict";
var node$$node_modules_builtin_modules_index = require("builtin-modules");
function prvt$getSyntaxKindName$src_visitors_debug(syntaxKind) {
    for (let property in node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind) {
        if (node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind[property] === syntaxKind) {
            return property;
        }
    }
}
const prvt$impl$src_visitors_debug = {
    filter: function filter(node) {
        // Print the start of a file
        if (node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.SourceFile) {
            console.log('--------', node.getSourceFile().fileName, '--------');
        }
        // Print the name of the node kind
        if (node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.Identifier) {
            console.log(prvt$getSyntaxKindName$src_visitors_debug(node.kind), '-', node.getText());
        }
        else {
            console.log(prvt$getSyntaxKindName$src_visitors_debug(node.kind));
        }
        return false;
    },
    visit: function visit(node, context) {
    }
};
//# sourceMappingURL=debug.js.map
const prvt$impl$src_visitors_cache_vars = {
    filter: function filter(node) {
        return node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.VariableStatement
            && node.parent.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.SourceFile;
    },
    visit: function visit(node, context) {
        let mangle = 'private';
        if (node.modifiers && node.modifiers.some(m => m.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ExportKeyword))
            mangle = 'export';
        if (node.modifiers && node.modifiers.some(m => m.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.DefaultKeyword))
            mangle = 'default';
        node.declarationList.declarations.forEach((decl) => {
            context.custom.addId(decl.name.getText(), mangle);
        });
    }
};
//# sourceMappingURL=cache-vars.js.map
const prvt$impl$src_visitors_cache_funcs = {
    filter: function filter(node) {
        return node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.FunctionDeclaration
            && node.parent.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.SourceFile;
    },
    visit: function visit(node, context) {
        let mangle = 'private';
        if (node.modifiers && node.modifiers.some(m => m.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ExportKeyword))
            mangle = 'export';
        if (node.modifiers && node.modifiers.some(m => m.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.DefaultKeyword))
            mangle = 'default';
        context.custom.addId(node.name.getText(), mangle);
    }
};
//# sourceMappingURL=cache-funcs.js.map
const prvt$impl$src_visitors_cache_classes = {
    filter: function filter(node) {
        return node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ClassDeclaration
            && node.parent.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.SourceFile;
    },
    visit: function visit(node, context) {
        let mangle = 'private';
        if (node.modifiers && node.modifiers.some(m => m.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ExportKeyword))
            mangle = 'export';
        if (node.modifiers && node.modifiers.some(m => m.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.DefaultKeyword))
            mangle = 'default';
        context.custom.addId(node.name.getText(), mangle);
    }
};
//# sourceMappingURL=cache-classes.js.map
const prvt$impl$src_visitors_default_exports = {
    filter: function filter(node) {
        return node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ExportAssignment;
    },
    visit: function visit(node, context) {
        if (node.isExportEquals) {
        }
        else {
            // export default <expression>
            context.custom.addDefault(node.expression.getText());
            // Remove the export
            context.replace(node.getStart(), node.getEnd(), '');
        }
    }
};
//# sourceMappingURL=default-exports.js.map
const prvt$impl$src_visitors_load_exports = {
    filter: function filter(node) {
        return node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ExportDeclaration;
    },
    visit: function visit(node, context) {
        // This is the module to be loaded, after removing the quotes
        let moduleName = node.moduleSpecifier.getText().slice(1, -1);
        let exportedProperties;
        if (node.exportClause) {
            exportedProperties = node.exportClause.elements.map((decl) => {
                // export { <exportedName> } from <modulePath>
                // export { <exportedName> as <exportedAs> } from <modulePath>
                let exportedAs = decl.name.getText();
                let exportedName = decl.propertyName ? decl.propertyName.getText() : exportedAs;
                return [exportedName, exportedAs];
            });
        }
        const output = context.custom.addExport(moduleName, exportedProperties);
        if (output) {
            if (typeof output === 'string') {
                context.replace(node.getStart(), node.getEnd(), `import ${output} from ${node.moduleSpecifier.getText()};`);
            }
            else if (typeof output === 'object') {
                context.replace(node.getStart(), node.getEnd(), output.code);
            }
            return;
        }
        // Remove the export
        context.replace(node.getStart(), node.getEnd(), '');
    }
};
//# sourceMappingURL=load-exports.js.map
const prvt$impl$src_visitors_load_imports = {
    filter: function filter(node) {
        return node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ImportDeclaration
            && node.parent.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.SourceFile;
    },
    visit: function visit(node, context) {
        // This is the module to be loaded, after removing the quotes
        let moduleName = node.moduleSpecifier.getText().slice(1, -1);
        function replace(output, _default) {
            if (typeof output === 'string') {
                context.replace(node.getStart(), node.getEnd(), `import ${_default ? '' : '* as '}${output} from ${node.moduleSpecifier.getText()};`);
            }
            else if (typeof output === 'object') {
                context.replace(node.getStart(), node.getEnd(), output.code);
            }
        }
        if (node.importClause) {
            if (node.importClause.name) {
                // import <importedName> from <modulePath>
                let importedAs = node.importClause.name.getText();
                const output = context.custom.addImport(moduleName, importedAs, true);
                if (output) {
                    replace(output, true);
                    return;
                }
            }
            if (node.importClause.namedBindings) {
                if (node.importClause.namedBindings.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.NamespaceImport) {
                    // import * as <importedAs> from <modulePath>
                    let importedAs = node.importClause.namedBindings.name.getText();
                    const output = context.custom.addImport(moduleName, importedAs, false);
                    if (output) {
                        replace(output);
                        return;
                    }
                }
                else if (node.importClause.namedBindings.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.NamedImports) {
                    const importedProperties = node.importClause.namedBindings.elements.map((decl) => {
                        // import { <importedName> } from <modulePath>
                        // import { <importedName> as <importedAs> } from <modulePath>
                        let importedAs = decl.name.getText();
                        let importedName = decl.propertyName ? decl.propertyName.getText() : importedAs;
                        return [importedName, importedAs];
                    });
                    const output = context.custom.addImport(moduleName, importedProperties, false);
                    if (output) {
                        replace(output);
                        return;
                    }
                }
            }
        }
        // Remove the import
        context.replace(node.getStart(), node.getEnd(), '');
    }
};
//# sourceMappingURL=load-imports.js.map
const prvt$impl$src_visitors_change_import_props = {
    filter: function filter(node) {
        return node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.PropertyAccessExpression
            && node.expression.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.Identifier;
    },
    visit: function visit(node, context) {
        const importedAs = node.expression.getText();
        const property = node.name.getText();
        const actualProperty = context.custom.getId(importedAs, property);
        if (actualProperty) {
            context.replace(node.getStart(), node.getEnd(), actualProperty);
        }
    }
};
//# sourceMappingURL=change-import-props.js.map
const prvt$impl$src_visitors_change_ids = {
    filter: function filter(node) {
        return node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.Identifier
            && node.parent.kind !== node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ExportAssignment // export default X; -OR- export = X;
            && node.parent.kind !== node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ImportClause // import X from <module>;
            && node.parent.kind !== node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ImportSpecifier // import { X as Y } from <module>;
            && node.parent.kind !== node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.NamespaceImport // import * as X from <module>;
            && node.parent.kind !== node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.MethodDeclaration // class Y { X() { ... } };
            && node.parent.kind !== node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.PropertyDeclaration // class Y { X: string };
            && (node.parent.kind !== node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.PropertyAccessExpression
                || node.parent.expression === node);
    },
    visit: function visit(node, context) {
        const replaceId = context.custom.getId(node.getText());
        if (replaceId) {
            context.replace(node.getStart(), node.getEnd(), replaceId);
        }
    }
};
//# sourceMappingURL=change-ids.js.map
const prvt$impl$src_visitors_remove_export = {
    filter: function filter(node) {
        return node.kind === node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.SyntaxKind.ExportKeyword;
    },
    visit: function visit(node, context) {
        // Remove the export keyword
        context.replace(node.getStart(), node.getEnd(), '');
    }
};
//# sourceMappingURL=remove-export.js.map
const prvt$visitors$src_visitors_index = [
    prvt$impl$src_visitors_debug,
    prvt$impl$src_visitors_cache_vars,
    prvt$impl$src_visitors_cache_funcs,
    prvt$impl$src_visitors_cache_classes,
    prvt$impl$src_visitors_default_exports,
    prvt$impl$src_visitors_load_exports,
    prvt$impl$src_visitors_load_imports,
    prvt$impl$src_visitors_change_import_props,
    prvt$impl$src_visitors_change_ids,
    prvt$impl$src_visitors_remove_export,
];
const prvt$MODULE_HOST$src_context = {
    fileExists: node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.sys.fileExists,
    readFile: node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.sys.readFile
};
class pblc$Context$src_context {
    constructor(options, sourceFile, parent) {
        this.options = options;
        this.sourceFile = sourceFile;
        this.parent = parent;
        this.ids = {};
        this.exports = {};
        this.imports = parent ? parent.imports : {};
        this.imports[sourceFile.fileName] = this;
    }
    /** Mangles the identifier, creating a globally unique name */
    mangleId(id, mangle, fileName) {
        fileName = fileName || this.sourceFile.fileName;
        if (this.options.mangleId) {
            return this.options.mangleId(fileName, id, mangle);
        }
        else {
            let prefix;
            switch (mangle) {
                case 'private':
                    prefix = 'prvt$';
                    break;
                case 'default':
                    prefix = 'pblc$';
                    break;
                case 'export':
                    prefix = 'pblc$';
                    break;
                case 'node':
                    prefix = 'node$';
                    break;
            }
            const extIndex = fileName.lastIndexOf('.');
            const postfix = '$' + (extIndex >= 0 ? fileName.substr(0, fileName.lastIndexOf('.')) : fileName).replace(/[^a-z0-9]/gmi, '_');
            return prefix + id + postfix;
        }
    }
    resolveModule(moduleName, parentPath) {
        parentPath = parentPath || '';
        const resolvedModule = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.resolveModuleName(moduleName, parentPath, this.options || {}, prvt$MODULE_HOST$src_context);
        let resolvedModuleName = resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName;
        // if (resolvedModuleName && resolvedModuleName[0] !== '/' && this.options['baseUrl']) {
        //     resolvedModuleName = path.join(this.options['baseUrl'], resolvedModuleName);
        // }
        return resolvedModuleName;
    }
    isNodeModule(modulePath) {
        if (node$$node_modules_builtin_modules_index.indexOf(modulePath) >= 0) {
            return true;
        }
        else {
            return modulePath.indexOf('/node_modules/') >= 0 || modulePath.indexOf('node_modules/') === 0;
        }
    }
    addId(id, mangle) {
        const mangledId = this.mangleId(id, mangle);
        this.ids[id] = mangledId;
        if (mangle === 'export')
            this.exports[id] = mangledId;
        if (mangle === 'default')
            this.exports[''] = mangledId;
    }
    addDefault(id) {
        this.exports[''] = this.ids[id];
    }
    getId(id, property) {
        if (id in this.ids) {
            if (property) {
                if (typeof this.ids[id] === 'object')
                    return this.ids[id][property];
            }
            else {
                if (typeof this.ids[id] === 'string')
                    return this.ids[id];
            }
        }
    }
    static transpile(options, modulePath, parentContext) {
        let custom;
        const fileContents = node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.sys.readFile(modulePath);
        const config = {
            sourceFileName: modulePath,
            compilerOptions: options,
            visitors: prvt$visitors$src_visitors_index,
            onBeforeTranspile: (ast, context) => {
                custom = new pblc$Context$src_context(options, ast, parentContext);
                context.custom = custom;
            }
        };
        const output = pblc$transpile$src_tspoon_transpile(fileContents, config);
        output.custom = custom;
        return output;
    }
    importModule(resolvedModulePath) {
        if (resolvedModulePath in this.imports) {
        }
        else {
            // The file has not yet been imported, so import it here
            return pblc$Context$src_context.transpile(this.options, resolvedModulePath, this);
        }
    }
    addImport(moduleName, importedAs, _default) {
        let resolvedModulePath = this.resolveModule(moduleName, this.sourceFile.fileName);
        const nodeModule = this.isNodeModule(resolvedModulePath || moduleName);
        if (!resolvedModulePath && !nodeModule)
            return;
        if (nodeModule) {
            resolvedModulePath = resolvedModulePath || moduleName;
            const assignIds = (id) => {
                if (typeof importedAs === 'string') {
                    this.ids[importedAs] = id;
                }
                else if (typeof importedAs === 'object') {
                    importedAs.forEach(importedProperty => {
                        this.ids[importedProperty[1]] = id + '.' + importedProperty[0];
                    });
                }
            };
            if (moduleName in this.imports) {
                assignIds(this.imports[moduleName]);
            }
            else {
                let id = this.mangleId('', 'node', resolvedModulePath);
                this.imports[moduleName] = id;
                assignIds(id);
                return id;
            }
        }
        else {
            const output = this.importModule(resolvedModulePath);
            if (typeof importedAs === 'string') {
                if (_default) {
                    this.ids[importedAs] = this.imports[resolvedModulePath].exports[''];
                }
                else {
                    this.ids[importedAs] = this.imports[resolvedModulePath].exports;
                }
            }
            else if (typeof importedAs === 'object') {
                importedAs.forEach(importedProperty => {
                    this.ids[importedProperty[1]] = this.imports[resolvedModulePath].exports[importedProperty[0]];
                });
            }
            return output;
        }
    }
    addExport(moduleName, exportedProps) {
        let resolvedModulePath = this.resolveModule(moduleName, this.sourceFile.fileName);
        const nodeModule = this.isNodeModule(resolvedModulePath || moduleName);
        if (!resolvedModulePath && !nodeModule)
            return;
        if (nodeModule) {
            resolvedModulePath = resolvedModulePath || moduleName;
            if (!(resolvedModulePath in this.imports)) {
                let id = this.mangleId('', 'node', resolvedModulePath);
                this.imports[moduleName] = id;
                return id;
            }
        }
        else {
            const output = this.importModule(resolvedModulePath);
            if (!exportedProps) {
                // Copy all of the exports over
                Object.assign(this.exports, this.imports[resolvedModulePath].exports);
            }
            else {
                exportedProps.forEach(([exportedProp, exportedPropAs]) => {
                    this.exports[exportedPropAs] = this.imports[resolvedModulePath].exports[exportedProp];
                });
            }
            return output;
        }
    }
}
//# sourceMappingURL=context.js.map
//# sourceMappingURL=compiler-options.js.map
const prvt$fileStats$src_index = node$$_Users_scott_ts_pack_node_modules__types_bluebird_index_d.promisify(node$$fs.lstat);
function pblc$compileFile$src_index(fileName, options) {
    // Use the default options if none were supplied
    options = options || {};
    const filePath = node$$path.resolve(fileName);
    return prvt$fileStats$src_index(filePath)
        .then((stats) => {
        if (stats.isFile()) {
            const output = pblc$Context$src_context.transpile(options, filePath);
            return output.code;
        }
        else {
            throw new Error(`File "${filePath}" not found`);
        }
    });
}
function pblc$compile$src_index(fileName, contents, options) {
    // Use the default options if none were supplied
    options = options || {};
    fileName = node$$path.resolve(fileName);
    return new node$$_Users_scott_ts_pack_node_modules__types_bluebird_index_d((resolve, reject) => {
        try {
            const output = pblc$Context$src_context.transpile(options, fileName);
            resolve(output.code);
        }
        catch (error) {
            reject(error);
        }
    });
}
//# sourceMappingURL=index.js.map
const prvt$opt$_Users_scott_ts_pack_src_main = new node$$_Users_scott_ts_pack_node_modules_node_getopt_index([
    ['h', 'help', 'Print this message.'],
    ['o', 'outFile=ARG', 'The output file.'],
    ['p', 'project=ARG', 'Compile the project in the given directory.'],
    ['v', 'version', 'Print the compiler\'s version.'],
])
    .bindHelp() // bind option 'help' to default action
    .parseSystem(); // parse command line
if (prvt$opt$_Users_scott_ts_pack_src_main) {
    for (let option in prvt$opt$_Users_scott_ts_pack_src_main.options) {
        switch (option) {
            case 'version':
                prvt$displayVersion$_Users_scott_ts_pack_src_main();
                process.exit(0);
        }
    }
    if (prvt$opt$_Users_scott_ts_pack_src_main.argv.length > 0) {
        let inFile = prvt$opt$_Users_scott_ts_pack_src_main.argv[0];
        let compilerOptions;
        let tsconfig = prvt$opt$_Users_scott_ts_pack_src_main.options['project'];
        if (tsconfig) {
            const stats = node$$fs.lstatSync(tsconfig);
            if (stats.isDirectory()) {
                tsconfig = node$$path.resolve(tsconfig, 'tsconfig.json');
            }
            const tsconfigJson = require(tsconfig);
            compilerOptions = tsconfigJson['compilerOptions'];
        }
        pblc$compileFile$src_index(inFile, compilerOptions)
            .then((output) => {
            let outFile = prvt$opt$_Users_scott_ts_pack_src_main.options['outFile'];
            if (!outFile) {
                // if (inFile.endsWith('.ts')) {
                //     outFile = inFile.slice(0, -3) + '.js';
                // } else {
                //     outFile = inFile + '.js';
                // }
                output.split('\n').forEach(line => console.log(line));
                return;
            }
            node$$fs.writeFileSync(outFile, output, { 'encoding': 'utf8' });
        })
            .catch((error) => {
            console.error(error.message);
        });
    }
}
function prvt$displayVersion$_Users_scott_ts_pack_src_main() {
    const _package = require('../package.json');
    console.info(`Version ${_package.version} [using typescript ${node$$_Users_scott_ts_pack_node_modules_typescript_lib_typescript_d.version}]`);
}
//# sourceMappingURL=main.js.map