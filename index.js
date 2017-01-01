!function(t,e){"use strict";function r(t,e){return function(){for(var r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];r.forEach(function(r){n(t,r,e)})}}function n(t,e,n){function i(t){return e.filter(t)?(e.visit(t,n,r(t,n)),n.halted||d.forEachChild(t,i)):d.forEachChild(t,i)}return i(t)}function i(t,e){var r=t.length,n=e.length;return r>n&&t.substr(r-n,n)===e}function o(t){return t.parseDiagnostics}function s(t,e){var r=e.compilerOptions||M,i=e.sourceFileName,s="string"==typeof t?d.createSourceFile(i,t,r.target,!0):t,a=o(s);if(a.length>0)return{code:null,diags:a,halted:!0,sourceMap:null};var u=new K(s.fileName);if(e.onBeforeTranspile&&e.onBeforeTranspile(s,u),e.visitors.some(function(t){return n(s,t,u),u.halted}),u.halted)return{code:null,sourceMap:null,diags:u.diags,halted:!0};e.onAfterTranspile&&e.onAfterTranspile(s,u);var c=new C(s);c.execute(u.actions);var p=new N(c.ast),l=d.createProgram([i],r,p),f=l.emit();if(f.diagnostics.forEach(function(t){u.pushDiag(c.translateDiagnostic(t))}),f.emitSkipped)return{code:null,sourceMap:null,diags:u.diags,halted:!0};var h=p.output,g=p.sourceMap,m=g?c.translateMap(g):null;return{code:h,sourceMap:m,diags:u.diags,halted:!1}}function a(t,e){if("."===t[0]||"/"===t[0]){e=e||"";var r=d.resolveModuleName(t,e,P,k);return r.resolvedModule&&r.resolvedModule.resolvedFileName}}function u(t,e){e=e||{};var r=l.resolve(t);return z(r).then(function(t){if(t.isFile()){var n=V.transpile(e,r);return n.code}throw new Error('File "'+r+'" not found')})}function c(){var t=require("../package.json");console.info("Version "+t.version+" [using typescript "+d.version+"]")}var p=require("fs"),l=require("path"),f=require("bluebird"),d=require("typescript"),h=require("node-getopt"),g=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},g=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},m=function(){function t(){}return t.prototype.fileExists=function(t){return!1},t.prototype.directoryExists=function(t){return!1},t.prototype.readFile=function(t){return null},t.prototype.getSourceFile=function(t,e,r){return null},t.prototype.writeFile=function(t,e,r){},t.prototype.useCaseSensitiveFileNames=function(){return!1},t.prototype.getCanonicalFileName=function(t){return t},t.prototype.getCurrentDirectory=function(){return""},t.prototype.getNewLine=function(){return"\n"},t.prototype.getDefaultLibFileName=function(t){return"lib.d.ts"},t.prototype.getCancellationToken=function(){return null},t.prototype.getDirectories=function(t){return[]},t}(),y=function(t){function e(){var e=t.apply(this,arguments)||this;return e.source=null,e}return g(e,t),e.prototype.setSource=function(t){if(null!==this.source)throw new Error("A chainable host can be connected to a source only once. It looks like you're trying to include the same instance in multiple chains.");this.source=t},e.prototype.fileExists=function(t){return this.source.fileExists(t)},e.prototype.directoryExists=function(t){return this.source.directoryExists(t)},e.prototype.getCurrentDirectory=function(){return this.source.getCurrentDirectory()},e.prototype.readFile=function(t){return this.source.readFile(t)},e.prototype.getSourceFile=function(t,e,r){return this.source.getSourceFile(t,e,r)},e.prototype.writeFile=function(t,e,r){this.source.writeFile(t,e,r)},e.prototype.getDirectories=function(t){return this.source.getDirectories(t)},e}(m),g=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},v=require("source-map"),x=require("magic-string"),S=function(){function t(){}return t}(),_=function(){function t(){}return t}(),E=function(t){function e(e,r,n){var i=t.call(this)||this;return i.start=e,i.end=r,i.str=n,i}return g(e,t),e.prototype.execute=function(t,e){this.start===this.end?e.appendLeft(this.start,this.str):e.overwrite(this.start,this.end,this.str);var r=d.createTextSpanFromBounds(this.start,this.end),n=d.createTextChangeRange(r,this.str.length);return t.update(e.toString(),n)},e.prototype.getStart=function(){return this.start},e}(S),F=function(t){function e(e,r){var n=t.call(this)||this;return n.start=e,n.str=r,n}return g(e,t),e.prototype.execute=function(t,e){e.appendLeft(this.start,this.str);var r=d.createTextSpanFromBounds(this.start,this.start),n=d.createTextChangeRange(r,this.str.length);return t.update(e.toString(),n)},e.prototype.getStart=function(){return this.start},e}(S),w=function(t){function e(e){var r=t.call(this)||this;return r.str=e,r}return g(e,t),e.prototype.execute=function(t){var e=t.text.length-1,r=d.createTextSpanFromBounds(e,e),n=d.createTextChangeRange(r,this.str.length);return t.update(t.text+this.str,n)},e}(_),b=function(t){function e(e,r){var n=t.call(this)||this;return n.start=e,n.str=r,n}return g(e,t),e.prototype.execute=function(t){var e=d.createTextSpanFromBounds(this.start,this.start+this.str.length),r=d.createTextChangeRange(e,this.str.length),n=t.text.slice(0,this.start)+this.str+t.text.slice(this.start+this.str.length);return t.update(n,r)},e}(_),D=function(t,e){return e.getStart()-t.getStart()},C=function(){function t(t){this._ast=t,this.originalText=t.text,this.origLineStarts=t.getLineStarts()}return Object.defineProperty(t.prototype,"ast",{get:function(){return this._ast},enumerable:!0,configurable:!0}),t.prototype.execute=function(t){var e=this,r=t.filter(function(t){return t instanceof _});r.forEach(function(t){e._ast=t.execute(e._ast)}),this.magicString=new x(this._ast.text);var n=t.filter(function(t){return t instanceof S}).sort(D);n.forEach(function(t){e._ast=t.execute(e._ast,e.magicString)})},Object.defineProperty(t.prototype,"sourceMap",{get:function(){return this.magicString||(this.magicString=new x(this._ast.text)),this._sourceMap||(this._sourceMap=this.magicString.generateMap({source:this._ast.fileName,hires:!0})),this._sourceMap},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"code",{get:function(){return this._ast.text},enumerable:!0,configurable:!0}),t.prototype.translateMap=function(t){var e=this.originalText,r=this._ast,n=new v.SourceMapConsumer(this.sourceMap),i=new v.SourceMapConsumer(t),o=new v.SourceMapGenerator;return o.setSourceContent(r.fileName,e),i.eachMapping(function(t){var e=n.originalPositionFor({line:t.originalLine,column:t.originalColumn});null!=e.line&&o.addMapping({source:r.fileName,name:t.name,generated:{line:t.generatedLine,column:t.generatedColumn},original:e})}),this._sourceMap=o.toJSON(),o.toJSON()},t.prototype.translateDiagnostic=function(t){var e=this.sourceMap,r=new v.SourceMapConsumer(e),n=t.file.getLineAndCharacterOfPosition(t.start),i=r.originalPositionFor({line:n.line+1,column:n.character});return null===i.line?t:{file:t.file,start:t.file.getPositionOfLineAndCharacter(i.line-1,i.column),length:t.length,messageText:t.messageText,category:t.category,code:t.code}},t}(),M={module:d.ModuleKind.CommonJS,jsx:d.JsxEmit.React,target:d.ScriptTarget.ES5,experimentalDecorators:!0,noEmitHelpers:!0,sourceMap:!0,preserveConstEnums:!0,inlineSources:!0,emitDecoratorMetadata:!1},N=(function(t){function e(e,r){void 0===r&&(r=M);var n=t.call(this)||this;return n._resolutionHosts=e,n._compilerOptions=r,n.syntacticErrors=[],n}return g(e,t),e.prototype.getCurrentDirectory=function(){var t="";return this._resolutionHosts.forEach(function(e){if(e.getCurrentDirectory){var r=e.getCurrentDirectory();r&&(t=r)}}),t},e.prototype.directoryExists=function(t){return this._resolutionHosts.some(function(e){return e.directoryExists&&e.directoryExists(t)})},e.prototype.getDirectories=function(t){return this._resolutionHosts.reduce(function(e,r){return r.getDirectories?e.concat(r.getDirectories(t)):e},[])},e.prototype.fileExists=function(t){return this._resolutionHosts.some(function(e){return e.fileExists(t)})},e.prototype.readFile=function(t){return this._resolutionHosts.reduce(function(e,r){return!e&&r.fileExists(t)?r.readFile(t):e},null)},e.prototype.getSourceFile=function(t){var e=this.readFile(t);if(e){var r=d.createSourceFile(t,e,this._compilerOptions.target,!0),n=this.getParserErrors(r);return n.length>0?((i=this.syntacticErrors).push.apply(i,n),null):r}return null;var i},e.prototype.getSyntacticErrors=function(){return this.syntacticErrors},e.prototype.getParserErrors=function(t){return t.parseDiagnostics},e}(m),function(t){function e(e){var r=t.call(this)||this;return r._ast=e,r._output="",r._map=null,r}return g(e,t),Object.defineProperty(e.prototype,"output",{get:function(){return this._output},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"sourceMap",{get:function(){return JSON.parse(this._map)},enumerable:!0,configurable:!0}),e.prototype.fileExists=function(t){return t===this._ast.fileName},e.prototype.readFile=function(t){if(t===this._ast.fileName)return this._ast.text},e.prototype.getSourceFile=function(t){if(t===this._ast.fileName)return this._ast},e.prototype.writeFile=function(t,e,r){i(t,"map")?this._map=e:this._output=e},e}(m)),K=function(){function t(t,e){void 0===e&&(e=null),this._fileName=t,this.langServiceProvider=e,this._halted=!1,this._actions=[],this._diags=[]}return t.prototype.isHalted=function(){return this._halted},t.prototype.insertLine=function(t,e){this.insert(t,e+"\n")},t.prototype.insert=function(t,e){this._actions.push(new F(t,e))},t.prototype.replace=function(t,e,r){this._actions.push(new E(t,e,r))},t.prototype.fastAppend=function(t){this._actions.push(new w(t))},t.prototype.fastRewrite=function(t,e){this._actions.push(new b(t,e))},t.prototype.reportDiag=function(t,e,r,n){var i={file:t.getSourceFile(),start:t.getStart(),length:t.getEnd()-t.getStart(),messageText:r,category:e,code:0};this._diags.push(i),this._halted=this._halted||n},t.prototype.pushDiag=function(t){this._diags.push(t)},Object.defineProperty(t.prototype,"actions",{get:function(){return this._actions},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"diags",{get:function(){return this._diags},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"halted",{get:function(){return this._halted},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"fileName",{get:function(){return this._fileName},enumerable:!0,configurable:!0}),t.prototype.getLanguageService=function(){return this.langServiceProvider?this.langServiceProvider():null},t}(),g=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},T=function(){function t(t,e){this.visitors=t,this.languageServiceProvider=e}return t.prototype.transform=function(t){var e=new K(t.fileName,this.languageServiceProvider);if(this.visitors.forEach(function(r){e.halted||n(t,r,e)}),e.halted)return null;var r=new C(t);return r.execute(e.actions),r},t}(),P=(d.normalizePath,d.getDirectoryPath,d.combinePaths,function(t){function e(){var e=t.apply(this,arguments)||this;return e.cache={},e}return g(e,t),e.prototype.getSourceFile=function(t,e,r){var n=this.cache[t];if(n)return n;var i=this.source.getSourceFile(t,e,r);return this.cache[t]=i,i},e}(y),function(t){function e(e,r){void 0===r&&(r=function(){return null});var n=t.call(this)||this;return n.transformations={},n.transformer=new T(e,r),n}return g(e,t),e.prototype.getSourceFile=function(e,r,n){var i=t.prototype.getSourceFile.call(this,e,r,n);if(i){var o=this.transformer.transform(i);return this.transformations[i.fileName]=o,o.ast}return null},e.prototype.getSourceMap=function(t){var e=this.transformations[t];return e?e.sourceMap:null},e.prototype.translateDiagnostic=function(t){var e=this.transformations[t.file.fileName];return e?e.translateDiagnostic(t):t},e}(y),function(t){function e(e,r,n){void 0===r&&(r=M),void 0===n&&(n="node_modules");var i=t.call(this)||this;return i.files=e,i.compilerOptions=r,i.libDir=n,i}return g(e,t),e.prototype.getProjectVersion=function(){return null},e.prototype.getScriptFileNames=function(){return this.files.slice()},e.prototype.getScriptVersion=function(t){return null},e.prototype.getScriptSnapshot=function(t){return d.ScriptSnapshot.fromString(this.readFile(t))},e.prototype.getLocalizedDiagnosticMessages=function(){return null},e.prototype.getCompilationSettings=function(){return this.compilerOptions},e.prototype.log=function(t){},e.prototype.trace=function(t){},e.prototype.error=function(t){},e.prototype.resolveModuleNames=function(t,e){var r=this;return t.map(function(t){return d.nodeModuleNameResolver(t,e,r.compilerOptions,r).resolvedModule})},e.prototype.directoryExists=function(t){return this.source.directoryExists?this.source.directoryExists(t):void 0},e.prototype.acquireDocument=function(t,e,r,n){return this.source.getSourceFile(t,e.target)},e.prototype.updateDocument=function(t,e,r,n){return this.source.getSourceFile(t,e.target)},e.prototype.releaseDocument=function(t,e){},e.prototype.reportStats=function(){return""},e}(y),{module:d.ModuleKind.CommonJS,target:d.ScriptTarget.ES5}),k={fileExists:d.sys.fileExists,readFile:d.sys.readFile},O={filter:function(t){return t.kind===d.SyntaxKind.VariableStatement&&t.parent.kind===d.SyntaxKind.SourceFile},visit:function(t,e){var r=t.modifiers&&t.modifiers.some(function(t){return t.kind===d.SyntaxKind.ExportKeyword}),n=t.modifiers&&t.modifiers.some(function(t){return t.kind===d.SyntaxKind.DefaultKeyword});t.declarationList.declarations.forEach(function(t){e.custom.addId(t.name.getText(),r,n)})}},j={filter:function(t){return t.kind===d.SyntaxKind.FunctionDeclaration&&t.parent.kind===d.SyntaxKind.SourceFile},visit:function(t,e){var r=t.modifiers&&t.modifiers.some(function(t){return t.kind===d.SyntaxKind.ExportKeyword}),n=t.modifiers&&t.modifiers.some(function(t){return t.kind===d.SyntaxKind.DefaultKeyword});e.custom.addId(t.name.getText(),r,n)}},I={filter:function(t){return t.kind===d.SyntaxKind.ClassDeclaration&&t.parent.kind===d.SyntaxKind.SourceFile},visit:function(t,e){var r=t.modifiers&&t.modifiers.some(function(t){return t.kind===d.SyntaxKind.ExportKeyword}),n=t.modifiers&&t.modifiers.some(function(t){return t.kind===d.SyntaxKind.DefaultKeyword});e.custom.addId(t.name.getText(),r,n)}},L={filter:function(t){return t.kind===d.SyntaxKind.ExportAssignment},visit:function(t,e){if(t.isExportEquals)throw new Error("unimplemented");e.custom.addDefault(t.expression.getText()),e.replace(t.getStart(),t.getEnd(),"")}},A={filter:function(t){return t.kind===d.SyntaxKind.ExportDeclaration},visit:function(t,e){var r,n=t.moduleSpecifier.getText().slice(1,-1);t.exportClause&&(r=t.exportClause.elements.map(function(t){var e=t.name.getText(),r=t.propertyName?t.propertyName.getText():e;return[r,e]}));var i=e.custom.addExport(n,r);return void 0!==i?void(i&&e.replace(t.getStart(),t.getEnd(),i.code)):void e.replace(t.getStart(),t.getEnd(),"")}},B={filter:function(t){return t.kind===d.SyntaxKind.ImportDeclaration&&t.parent.kind===d.SyntaxKind.SourceFile},visit:function(t,e){var r=t.moduleSpecifier.getText().slice(1,-1);if(t.importClause){if(t.importClause.name){var n=t.importClause.name.getText(),i=e.custom.addImport(r,n,!0);if(i)return void e.replace(t.getStart(),t.getEnd(),i.code)}if(t.importClause.namedBindings)if(t.importClause.namedBindings.kind===d.SyntaxKind.NamespaceImport){var n=t.importClause.namedBindings.name.getText(),i=e.custom.addImport(r,n,!1);if(void 0!==i)return void(i&&e.replace(t.getStart(),t.getEnd(),i.code))}else if(t.importClause.namedBindings.kind===d.SyntaxKind.NamedImports){var o=t.importClause.namedBindings.elements.map(function(t){var e=t.name.getText(),r=t.propertyName?t.propertyName.getText():e;return[r,e]}),i=e.custom.addImport(r,o,!1);if(void 0!==i)return void(i&&e.replace(t.getStart(),t.getEnd(),i.code))}}e.replace(t.getStart(),t.getEnd(),"")}},q={filter:function(t){return t.kind===d.SyntaxKind.PropertyAccessExpression&&t.expression.kind===d.SyntaxKind.Identifier},visit:function(t,e){var r=t.expression.getText(),n=t.name.getText(),i=e.custom.getId(r,n);i&&e.replace(t.getStart(),t.getEnd(),i)}},H={filter:function(t){return t.kind===d.SyntaxKind.Identifier&&t.parent.kind!==d.SyntaxKind.ExportAssignment&&t.parent.kind!==d.SyntaxKind.ImportClause&&t.parent.kind!==d.SyntaxKind.ImportSpecifier&&t.parent.kind!==d.SyntaxKind.MethodDeclaration&&t.parent.kind!==d.SyntaxKind.PropertyDeclaration&&(t.parent.kind!==d.SyntaxKind.PropertyAccessExpression||t.parent.expression===t)},visit:function(t,e){var r=e.custom.getId(t.getText());r&&e.replace(t.getStart(),t.getEnd(),r)}},R={filter:function(t){return t.kind===d.SyntaxKind.ExportKeyword},visit:function(t,e){e.replace(t.getStart(),t.getEnd(),"")}},J=[O,j,I,L,A,B,q,H,R],V=function(){function t(t,e,r){this.options=t,this.sourceFile=e,this.parent=r,this.ids={},this.exports={},this.imports=r?r.imports:{},this.imports[e.fileName]=this}return t.prototype.mangleId=function(t,e){if(this.options.mangleId)return this.options.mangleId(this.sourceFile.fileName,t,e);var r=this.sourceFile.fileName,n=e?"_pbl__":"_prv__",i="__"+r.substr(0,r.lastIndexOf(".")).replace(/[^a-z0-9]/gim,"_");return n+t+i},t.prototype.addId=function(t,e,r){var n=this.mangleId(t,e);this.ids[t]=n,e&&(this.exports[t]=n),r&&(this.exports[""]=n)},t.prototype.addDefault=function(t){this.exports[""]=this.ids[t]},t.prototype.getId=function(t,e){if(t in this.ids)if(e){if("object"==typeof this.ids[t])return this.ids[t][e]}else if("string"==typeof this.ids[t])return this.ids[t]},t.transpile=function(e,r,n){var i,o=d.sys.readFile(r),a={sourceFileName:r,compilerOptions:e,visitors:J,onBeforeTranspile:function(r,o){i=new t(e,r,n),o.custom=i}},u=s(o,a);return u.custom=i,u},t.prototype.importModule=function(e){if(!(e in this.imports))return t.transpile(this.options,e,this)},t.prototype.addImport=function(t,e,r){var n=this,i=a(t,this.sourceFile.fileName);if(i){var o=this.importModule(i);return"string"==typeof e?r?this.ids[e]=this.imports[i].exports[""]:this.ids[e]=this.imports[i].exports:"object"==typeof e&&e.forEach(function(t){n.ids[t[1]]=n.imports[i].exports[t[0]]}),o}if(!(t in this.imports))return this.imports[t]=null,null},t.prototype.addExport=function(t,e){var r=this,n=a(t,this.sourceFile.fileName);if(n){var i=this.importModule(n);if(e)e.forEach(function(t){var e=t[0],i=t[1];r.exports[i]=r.imports[n].exports[e]});else for(var o in this.imports[n].exports)this.exports[o]=this.imports[n].exports[o];return i}if(!(t in this.imports))return this.imports[t]=null,null},t}(),z=f.promisify(p.lstat),G=new h([["h","help","Print this message."],["o","outFile=ARG","The output file."],["p","project=ARG","Compile the project in the given directory."],["v","version","Print the compiler's version."]]).bindHelp().parseSystem();if(G){for(var W in G.options)switch(W){case"version":c(),process.exit(0)}if(G.argv.length>0){var Q=G.argv[0],U=void 0,X=G.options.project;if(X){var Y=p.lstatSync(X);Y.isDirectory()&&(X=l.join(X,"tsconfig.json"));var Z=require(X);U=Z.compilerOptions}u(Q,U).then(function(t){var e=G.options.outFile;e||(e=Q.endsWith(".ts")?Q.slice(0,-3)+".js":Q+".js"),p.writeFileSync(e,t,{encoding:"utf8"})}).catch(function(t){console.error(t.message)})}}e.tsPack=t}({},function(){return this}());