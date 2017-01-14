!function(){"use strict";function t(t,r){return function(){for(var n=[],i=0;i<arguments.length;i++)n[i]=arguments[i];n.forEach(function(n){e(t,n,r)})}}function e(e,r,n){function i(e){return r.filter(e)?(r.visit(e,n,t(e,n)),n.halted||m.forEachChild(e,i)):m.forEachChild(e,i)}return i(e)}function r(t,e){var r=t.length,n=e.length;return r>n&&t.substr(r-n,n)===e}function n(t){return t.parseDiagnostics}function i(t,r){var i=r.compilerOptions||K,o=r.sourceFileName,s="string"==typeof t?m.createSourceFile(o,t,i.target,!0):t,a=n(s);if(a.length>0)return{code:null,diags:a,halted:!0,sourceMap:null};var u=new N(s.fileName);if(r.onBeforeTranspile&&r.onBeforeTranspile(s,u),r.visitors.some(function(t){return e(s,t,u),u.halted}),u.halted)return{code:null,sourceMap:null,diags:u.diags,halted:!0};r.onAfterTranspile&&r.onAfterTranspile(s,u);var c=new D(s);c.execute(u.actions);var p=new T(c.ast),l=m.createProgram([o],i,p),f=l.emit();if(f.diagnostics.forEach(function(t){u.pushDiag(c.translateDiagnostic(t))}),f.emitSkipped)return{code:null,sourceMap:null,diags:u.diags,halted:!0};var d=p.output,h=p.sourceMap,g=h?c.translateMap(h):null;return{code:d,sourceMap:g,diags:u.diags,halted:!1}}function o(t,e){return t=t||{},e=e||t.packOptions,e?(e.emitCustomHelpers&&(t.noEmitHelpers=!0),e.hash||(e.hash=a),e.mangleId||(e.mangleId=u)):(t.noEmitHelpers=!0,e={emitCustomHelpers:!0,hash:a,mangleId:u}),Object.assign(t,{packOptions:e})}function s(t){var e=Object.assign({},t);return delete e.packOptions,e}function a(t){if("string"==typeof t){var e=t.lastIndexOf(".");return(e>=0?t.substr(0,e):t).replace(/[^a-z0-9]/gim,"_")}return Q.createHash("sha1").update(t.getText(),"utf8").digest("hex")}function u(t,e,r,n){if(n&&n.packOptions&&n.packOptions.alias&&e in n.packOptions.alias)return n.packOptions.alias[e];var i;switch(r){case 0:i="$i$";break;case 1:case 2:i="$x$";break;case 3:i="$n$"}return i+=t.replace(/[^a-z0-9]/gim,"_"),e+i}function c(t){return Y(t,"utf8").then(function(e){var r=m.parseConfigFileTextToJson(t,e);if(r.error)throw r.error;var n=m.parseJsonConfigFileContent(r.config,et,h.dirname(t));return o(n.options,n.raw.packOptions)})}function p(t,e){return function(){return g.resolve().then(function(){return t.packOptions.emitCustomHelpers?Y(Z,"utf8"):""}).then(e).then(function(e){var r=t.packOptions.wrapOutput;if(r){var n=r.indexOf(tt);e=r.substring(0,n)+e+r.substring(n+tt.length)}return e})}}function l(t,e){e=o(e);var r=h.resolve(t);return X(r).then(function(t){if(!t.isFile())throw new Error('Could not read from file "'+r+'"')}).then(p(e,function(t){var n=U.transpileFile(e,r);return t+n.code}))}function f(){var t=require("../package.json");console.info("Version "+t.version+" [using typescript "+m.version+"]")}var d=require("fs"),h=require("path"),g=require("bluebird"),m=require("typescript"),y=require("node-getopt"),x=require("source-map"),v=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},v=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},S=function(){function t(){}return t.prototype.fileExists=function(t){return!1},t.prototype.directoryExists=function(t){return!1},t.prototype.readFile=function(t){return null},t.prototype.getSourceFile=function(t,e,r){return null},t.prototype.writeFile=function(t,e,r){},t.prototype.useCaseSensitiveFileNames=function(){return!1},t.prototype.getCanonicalFileName=function(t){return t},t.prototype.getCurrentDirectory=function(){return""},t.prototype.getNewLine=function(){return"\n"},t.prototype.getDefaultLibFileName=function(t){return"lib.d.ts"},t.prototype.getCancellationToken=function(){return null},t.prototype.getDirectories=function(t){return[]},t}(),E=function(t){function e(){var e=t.apply(this,arguments)||this;return e.source=null,e}return v(e,t),e.prototype.setSource=function(t){if(null!==this.source)throw new Error("A chainable host can be connected to a source only once. It looks like you're trying to include the same instance in multiple chains.");this.source=t},e.prototype.fileExists=function(t){return this.source.fileExists(t)},e.prototype.directoryExists=function(t){return this.source.directoryExists(t)},e.prototype.getCurrentDirectory=function(){return this.source.getCurrentDirectory()},e.prototype.readFile=function(t){return this.source.readFile(t)},e.prototype.getSourceFile=function(t,e,r){return this.source.getSourceFile(t,e,r)},e.prototype.writeFile=function(t,e,r){this.source.writeFile(t,e,r)},e.prototype.getDirectories=function(t){return this.source.getDirectories(t)},e}(S),v=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},_=require("magic-string"),F=function(){function t(){}return t}(),b=function(){function t(){}return t}(),k=function(t){function e(e,r,n){var i=t.call(this)||this;return i.start=e,i.end=r,i.str=n,i}return v(e,t),e.prototype.execute=function(t,e){this.start===this.end?e.appendLeft(this.start,this.str):e.overwrite(this.start,this.end,this.str);var r=m.createTextSpanFromBounds(this.start,this.end),n=m.createTextChangeRange(r,this.str.length);return t.update(e.toString(),n)},e.prototype.getStart=function(){return this.start},e}(F),w=function(t){function e(e,r){var n=t.call(this)||this;return n.start=e,n.str=r,n}return v(e,t),e.prototype.execute=function(t,e){e.appendLeft(this.start,this.str);var r=m.createTextSpanFromBounds(this.start,this.start),n=m.createTextChangeRange(r,this.str.length);return t.update(e.toString(),n)},e.prototype.getStart=function(){return this.start},e}(F),O=function(t){function e(e){var r=t.call(this)||this;return r.str=e,r}return v(e,t),e.prototype.execute=function(t){var e=t.text.length-1,r=m.createTextSpanFromBounds(e,e),n=m.createTextChangeRange(r,this.str.length);return t.update(t.text+this.str,n)},e}(b),M=function(t){function e(e,r){var n=t.call(this)||this;return n.start=e,n.str=r,n}return v(e,t),e.prototype.execute=function(t){var e=m.createTextSpanFromBounds(this.start,this.start+this.str.length),r=m.createTextChangeRange(e,this.str.length),n=t.text.slice(0,this.start)+this.str+t.text.slice(this.start+this.str.length);return t.update(n,r)},e}(b),C=function(t,e){return e.getStart()-t.getStart()},D=function(){function t(t){this._ast=t,this.originalText=t.text,this.origLineStarts=t.getLineStarts()}return Object.defineProperty(t.prototype,"ast",{get:function(){return this._ast},enumerable:!0,configurable:!0}),t.prototype.execute=function(t){var e=this,r=t.filter(function(t){return t instanceof b});r.forEach(function(t){e._ast=t.execute(e._ast)}),this.magicString=new _(this._ast.text);var n=t.filter(function(t){return t instanceof F}).sort(C);n.forEach(function(t){e._ast=t.execute(e._ast,e.magicString)})},Object.defineProperty(t.prototype,"sourceMap",{get:function(){return this.magicString||(this.magicString=new _(this._ast.text)),this._sourceMap||(this._sourceMap=this.magicString.generateMap({source:this._ast.fileName,hires:!0})),this._sourceMap},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"code",{get:function(){return this._ast.text},enumerable:!0,configurable:!0}),t.prototype.translateMap=function(t){var e=this.originalText,r=this._ast,n=new x.SourceMapConsumer(this.sourceMap),i=new x.SourceMapConsumer(t),o=new x.SourceMapGenerator;return o.setSourceContent(r.fileName,e),i.eachMapping(function(t){var e=n.originalPositionFor({line:t.originalLine,column:t.originalColumn});null!=e.line&&o.addMapping({source:r.fileName,name:t.name,generated:{line:t.generatedLine,column:t.generatedColumn},original:e})}),this._sourceMap=o.toJSON(),o.toJSON()},t.prototype.translateDiagnostic=function(t){var e=this.sourceMap,r=new x.SourceMapConsumer(e),n=t.file.getLineAndCharacterOfPosition(t.start),i=r.originalPositionFor({line:n.line+1,column:n.character});return null===i.line?t:{file:t.file,start:t.file.getPositionOfLineAndCharacter(i.line-1,i.column),length:t.length,messageText:t.messageText,category:t.category,code:t.code}},t}(),K={module:m.ModuleKind.CommonJS,jsx:m.JsxEmit.React,target:m.ScriptTarget.ES5,experimentalDecorators:!0,noEmitHelpers:!0,sourceMap:!0,preserveConstEnums:!0,inlineSources:!0,emitDecoratorMetadata:!1},T=(function(t){function e(e,r){void 0===r&&(r=K);var n=t.call(this)||this;return n._resolutionHosts=e,n._compilerOptions=r,n.syntacticErrors=[],n}return v(e,t),e.prototype.getCurrentDirectory=function(){var t="";return this._resolutionHosts.forEach(function(e){if(e.getCurrentDirectory){var r=e.getCurrentDirectory();r&&(t=r)}}),t},e.prototype.directoryExists=function(t){return this._resolutionHosts.some(function(e){return e.directoryExists&&e.directoryExists(t)})},e.prototype.getDirectories=function(t){return this._resolutionHosts.reduce(function(e,r){return r.getDirectories?e.concat(r.getDirectories(t)):e},[])},e.prototype.fileExists=function(t){return this._resolutionHosts.some(function(e){return e.fileExists(t)})},e.prototype.readFile=function(t){return this._resolutionHosts.reduce(function(e,r){return!e&&r.fileExists(t)?r.readFile(t):e},null)},e.prototype.getSourceFile=function(t){var e=this.readFile(t);if(e){var r=m.createSourceFile(t,e,this._compilerOptions.target,!0),n=this.getParserErrors(r);return n.length>0?((i=this.syntacticErrors).push.apply(i,n),null):r}return null;var i},e.prototype.getSyntacticErrors=function(){return this.syntacticErrors},e.prototype.getParserErrors=function(t){return t.parseDiagnostics},e}(S),function(t){function e(e){var r=t.call(this)||this;return r._ast=e,r._output="",r._map=null,r}return v(e,t),Object.defineProperty(e.prototype,"output",{get:function(){return this._output},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"sourceMap",{get:function(){return JSON.parse(this._map)},enumerable:!0,configurable:!0}),e.prototype.fileExists=function(t){return t===this._ast.fileName},e.prototype.readFile=function(t){if(t===this._ast.fileName)return this._ast.text},e.prototype.getSourceFile=function(t){if(t===this._ast.fileName)return this._ast},e.prototype.writeFile=function(t,e,n){r(t,"map")?this._map=e:this._output=e},e}(S)),N=function(){function t(t,e){void 0===e&&(e=null),this._fileName=t,this.langServiceProvider=e,this._halted=!1,this._actions=[],this._diags=[]}return t.prototype.isHalted=function(){return this._halted},t.prototype.insertLine=function(t,e){this.insert(t,e+"\n")},t.prototype.insert=function(t,e){this._actions.push(new w(t,e))},t.prototype.replace=function(t,e,r){this._actions.push(new k(t,e,r))},t.prototype.fastAppend=function(t){this._actions.push(new O(t))},t.prototype.fastRewrite=function(t,e){this._actions.push(new M(t,e))},t.prototype.reportDiag=function(t,e,r,n){var i={file:t.getSourceFile(),start:t.getStart(),length:t.getEnd()-t.getStart(),messageText:r,category:e,code:0};this._diags.push(i),this._halted=this._halted||n},t.prototype.pushDiag=function(t){this._diags.push(t)},Object.defineProperty(t.prototype,"actions",{get:function(){return this._actions},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"diags",{get:function(){return this._diags},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"halted",{get:function(){return this._halted},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"fileName",{get:function(){return this._fileName},enumerable:!0,configurable:!0}),t.prototype.getLanguageService=function(){return this.langServiceProvider?this.langServiceProvider():null},t}(),v=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)},P=function(){function t(t,e){this.visitors=t,this.languageServiceProvider=e}return t.prototype.transform=function(t){var r=new N(t.fileName,this.languageServiceProvider);if(this.visitors.forEach(function(n){r.halted||e(t,n,r)}),r.halted)return null;var n=new D(t);return n.execute(r.actions),n},t}(),I=(m.normalizePath,m.getDirectoryPath,m.combinePaths,function(t){function e(){var e=t.apply(this,arguments)||this;return e.cache={},e}return v(e,t),e.prototype.getSourceFile=function(t,e,r){var n=this.cache[t];if(n)return n;var i=this.source.getSourceFile(t,e,r);return this.cache[t]=i,i},e}(E),function(t){function e(e,r){void 0===r&&(r=function(){return null});var n=t.call(this)||this;return n.transformations={},n.transformer=new P(e,r),n}return v(e,t),e.prototype.getSourceFile=function(e,r,n){var i=t.prototype.getSourceFile.call(this,e,r,n);if(i){var o=this.transformer.transform(i);return this.transformations[i.fileName]=o,o.ast}return null},e.prototype.getSourceMap=function(t){var e=this.transformations[t];return e?e.sourceMap:null},e.prototype.translateDiagnostic=function(t){var e=this.transformations[t.file.fileName];return e?e.translateDiagnostic(t):t},e}(E),function(t){function e(e,r,n){void 0===r&&(r=K),void 0===n&&(n="node_modules");var i=t.call(this)||this;return i.files=e,i.compilerOptions=r,i.libDir=n,i}return v(e,t),e.prototype.getProjectVersion=function(){return null},e.prototype.getScriptFileNames=function(){return this.files.slice()},e.prototype.getScriptVersion=function(t){return null},e.prototype.getScriptSnapshot=function(t){return m.ScriptSnapshot.fromString(this.readFile(t))},e.prototype.getLocalizedDiagnosticMessages=function(){return null},e.prototype.getCompilationSettings=function(){return this.compilerOptions},e.prototype.log=function(t){},e.prototype.trace=function(t){},e.prototype.error=function(t){},e.prototype.resolveModuleNames=function(t,e){var r=this;return t.map(function(t){return m.nodeModuleNameResolver(t,e,r.compilerOptions,r).resolvedModule})},e.prototype.directoryExists=function(t){return this.source.directoryExists?this.source.directoryExists(t):void 0},e.prototype.acquireDocument=function(t,e,r,n){return this.source.getSourceFile(t,e.target)},e.prototype.updateDocument=function(t,e,r,n){return this.source.getSourceFile(t,e.target)},e.prototype.releaseDocument=function(t,e){},e.prototype.reportStats=function(){return""},e}(E),require("builtin-modules")),j={filter:function(t){return t.kind===m.SyntaxKind.VariableStatement&&t.parent.kind===m.SyntaxKind.SourceFile},visit:function(t,e){var r=0;t.modifiers&&t.modifiers.some(function(t){return t.kind===m.SyntaxKind.ExportKeyword})&&(r=1),t.modifiers&&t.modifiers.some(function(t){return t.kind===m.SyntaxKind.DefaultKeyword})&&(r=2),t.declarationList.declarations.forEach(function(t){e.custom.addId(t.name.getText(),r)})}},H={filter:function(t){return t.kind===m.SyntaxKind.FunctionDeclaration&&t.parent.kind===m.SyntaxKind.SourceFile},visit:function(t,e){var r=0;t.modifiers&&t.modifiers.some(function(t){return t.kind===m.SyntaxKind.ExportKeyword})&&(r=1),t.modifiers&&t.modifiers.some(function(t){return t.kind===m.SyntaxKind.DefaultKeyword})&&(r=2);var n=e.custom.addId(t.name?t.name.getText():"",r);t.name||e.insert(t.getStart()+t.getText().indexOf("function")+"function".length," "+n)}},L={filter:function(t){return t.kind===m.SyntaxKind.ClassDeclaration&&t.parent.kind===m.SyntaxKind.SourceFile},visit:function(t,e){var r=0;t.modifiers&&t.modifiers.some(function(t){return t.kind===m.SyntaxKind.ExportKeyword})&&(r=1),t.modifiers&&t.modifiers.some(function(t){return t.kind===m.SyntaxKind.DefaultKeyword})&&(r=2),e.custom.addId(t.name.getText(),r)}},q={filter:function(t){return t.kind===m.SyntaxKind.EnumDeclaration&&t.modifiers&&t.modifiers.some(function(t){return t.kind===m.SyntaxKind.ConstKeyword})},visit:function(t,e){var r=0;t.modifiers&&t.modifiers.some(function(t){return t.kind===m.SyntaxKind.ExportKeyword})&&(r=1),t.modifiers&&t.modifiers.some(function(t){return t.kind===m.SyntaxKind.DefaultKeyword})&&(r=2);var n={},i=0;t.members.forEach(function(t){var e,r=t.name.getText();if(t.initializer){if(t.initializer.kind!==m.SyntaxKind.NumericLiteral)throw new Error("Unimplemented");i=+t.initializer.getText()}e=i+" /* "+r+" */",++i,n[r]=e}),e.custom.addEnum(t.name.getText(),n,r)}},A={filter:function(t){return t.kind===m.SyntaxKind.ExportAssignment},visit:function(t,e){if(t.isExportEquals);else if(t.expression.kind===m.SyntaxKind.Identifier)e.custom.addDefault(t.expression.getText()),e.replace(t.getStart(),t.getEnd(),"");else{var r=e.custom.addDefault();e.replace(t.getStart(),t.getEnd(),"const "+r+" = "+t.expression.getText()+";")}}},B={filter:function(t){return t.kind===m.SyntaxKind.ExportDeclaration&&!t.moduleSpecifier},visit:function(t,e){var r=t.exportClause.elements.map(function(t){var e=t.name.getText(),r=t.propertyName?t.propertyName.getText():e;return[r,e]});e.custom.addExport(r),e.replace(t.getStart(),t.getEnd(),"")}},R={filter:function(t){return t.kind===m.SyntaxKind.ExportDeclaration&&!!t.moduleSpecifier},visit:function(t,e){var r,n=t.moduleSpecifier.getText().slice(1,-1);t.exportClause&&(r=t.exportClause.elements.map(function(t){var e=t.name.getText(),r=t.propertyName?t.propertyName.getText():e;return[r,e]}));var i=e.custom.addExportModule(n,r);return i?void("string"==typeof i?e.replace(t.getStart(),t.getEnd(),"import "+i+" from "+t.moduleSpecifier.getText()+";"):"object"==typeof i&&e.replace(t.getStart(),t.getEnd(),i.code)):void e.replace(t.getStart(),t.getEnd(),"")}},$={filter:function(t){return t.kind===m.SyntaxKind.ImportDeclaration&&t.parent.kind===m.SyntaxKind.SourceFile},visit:function(t,e){function r(r,n){"string"==typeof r?e.replace(t.getStart(),t.getEnd(),"import "+(n?"":"* as ")+r+" from "+t.moduleSpecifier.getText()+";"):"object"==typeof r&&e.replace(t.getStart(),t.getEnd(),r.code)}var n=t.moduleSpecifier.getText().slice(1,-1);if(t.importClause){if(t.importClause.name){var i=t.importClause.name.getText(),o=e.custom.addImportModule(n,i,!0);if(o)return void r(o,!0)}if(t.importClause.namedBindings)if(t.importClause.namedBindings.kind===m.SyntaxKind.NamespaceImport){var i=t.importClause.namedBindings.name.getText(),o=e.custom.addImportModule(n,i,!1);if(o)return void r(o)}else if(t.importClause.namedBindings.kind===m.SyntaxKind.NamedImports){var s=t.importClause.namedBindings.elements.map(function(t){var e=t.name.getText(),r=t.propertyName?t.propertyName.getText():e;return[r,e]}),o=e.custom.addImportModule(n,s,!1);if(o)return void r(o)}}e.replace(t.getStart(),t.getEnd(),"")}},z={filter:function(t){return t.kind===m.SyntaxKind.PropertyAccessExpression&&t.expression.kind===m.SyntaxKind.Identifier},visit:function(t,e){var r=t.expression.getText(),n=t.name.getText(),i=e.custom.getId(r,n);i&&e.replace(t.getStart(),t.getEnd(),i)}},J={filter:function(t){return t.kind===m.SyntaxKind.Identifier&&t.parent.kind!==m.SyntaxKind.ExportAssignment&&t.parent.kind!==m.SyntaxKind.ExportSpecifier&&t.parent.kind!==m.SyntaxKind.ImportClause&&t.parent.kind!==m.SyntaxKind.ImportSpecifier&&t.parent.kind!==m.SyntaxKind.NamespaceImport&&t.parent.kind!==m.SyntaxKind.MethodDeclaration&&t.parent.kind!==m.SyntaxKind.PropertyDeclaration&&(t.parent.kind!==m.SyntaxKind.PropertyAccessExpression||t.parent.expression===t)},visit:function(t,e){var r=e.custom.getId(t.getText());r&&e.replace(t.getStart(),t.getEnd(),r)}},V={filter:function(t){return t.kind===m.SyntaxKind.ExportKeyword&&t.parent.kind!==m.SyntaxKind.EnumDeclaration},visit:function(t,e){e.replace(t.getStart(),t.getEnd(),"")}},G=[j,H,L,q,A,B,R,$,z,J,V],W={fileExists:m.sys.fileExists,readFile:m.sys.readFile},U=function(){function t(t,e,r){this.options=t,this.sourceFile=e,this.parent=r,this.ids={},this.exports={},this.imports=r?r.imports:{},this.imports[e.fileName]=this,this.hash=t.packOptions.hash(e)}return t.prototype.mangleId=function(t,e,r){return this.options.packOptions.mangleId(r||this.hash,t,e,this.options)},t.prototype.resolveModule=function(t,e){e=e||"";var r=m.resolveModuleName(t,e,this.options||{},W),n=r.resolvedModule&&r.resolvedModule.resolvedFileName;return n&&(n.endsWith(".d.ts")||n.endsWith(".js"))&&(n=t),n},t.prototype.isNodeModule=function(t){var e=this.options.packOptions.excludeImports;return!!(I.indexOf(t)>=0||e&&e.indexOf(t)>=0)||(t.indexOf("/node_modules/")>=0||0===t.indexOf("node_modules/"))},t.prototype.addId=function(t,e){var r=this.mangleId(t,e);return this.ids[t]=r,1===e&&(this.exports[t]=r),2===e&&(this.exports[""]=r),r},t.prototype.addDefault=function(t){var e;return e=t?this.ids[t]:this.mangleId("",2),this.exports[""]=e,e},t.prototype.getId=function(t,e){if(t in this.ids)if(e){if("object"==typeof this.ids[t])return this.ids[t][e]}else if("string"==typeof this.ids[t])return this.ids[t]},t.prototype.addEnum=function(t,e,r){switch(this.ids[t]=e,r){case 2:this.exports[""]=e;case 1:this.exports[t]=e}},t.prototype.addExport=function(t){var e=this;t.forEach(function(t){var r=t[0],n=t[1];e.exports[n]=e.ids[r]})},t.transpile=function(e,r,n,o){var a,u={sourceFileName:r,compilerOptions:s(e),visitors:G,onBeforeTranspile:function(r,n){a=new t(e,r,o),n.custom=a}},c=i(n,u);return c.custom=a,c},t.transpileFile=function(e,r,n){var i=m.sys.readFile(r);return t.transpile(e,r,i,n)},t.prototype.importModule=function(e){if(!(e in this.imports))return t.transpileFile(this.options,e,this)},t.prototype.addImportModule=function(t,e,r){var n=this,i=this.resolveModule(t,this.sourceFile.fileName),o=this.isNodeModule(i||t);if(i||o){if(!o){var s=this.importModule(i);return"string"==typeof e?r?this.ids[e]=this.imports[i].exports[""]:this.ids[e]=this.imports[i].exports:"object"==typeof e&&e.forEach(function(t){n.ids[t[1]]=n.imports[i].exports[t[0]]}),s}i=i||t;var a=function(t){"string"==typeof e?n.ids[e]=t:"object"==typeof e&&e.forEach(function(e){n.ids[e[1]]=t+"."+e[0]})};if(!(t in this.imports)){var u=this.mangleId("",3,i);return this.imports[t]=u,a(u),u}a(this.imports[t])}},t.prototype.addExportModule=function(t,e){var r=this,n=this.resolveModule(t,this.sourceFile.fileName),i=this.isNodeModule(n||t);if(n||i){if(!i){var o=this.importModule(n);return e?e.forEach(function(t){var e=t[0],i=t[1];r.exports[i]=r.imports[n].exports[e]}):Object.assign(this.exports,this.imports[n].exports),o}if(n=n||t,!(n in this.imports)){var s=this.mangleId("",3,n);return this.imports[t]=s,s}}},t}(),Q=require("crypto"),X=g.promisify(d.lstat),Y=g.promisify(d.readFile),Z=h.resolve(__dirname,"helpers.js"),tt="%output%",et={useCaseSensitiveFileNames:!1,fileExists:m.sys.fileExists,readFile$i$bb3d6acff25a428c1102778e81406a5ef0a158f3:m.sys.readFile,readDirectory:m.sys.readDirectory},rt=new y([["h","help","Print this message."],["o","outFile=ARG","The output file. Otherwise logs to the console."],["p","project=ARG","Compile the project in the given directory."],["v","version","Print the compiler's version."]]).bindHelp().parseSystem();if(rt){for(var nt in rt.options)switch(nt){case"version":f(),process.exit(0)}if(rt.argv.length>0){var it=rt.argv[0],ot=void 0,st=rt.options.project;if(st){var at=d.lstatSync(st);at.isDirectory()&&(st=h.resolve(st,"tsconfig.json")),ot=c(st)}else ot=g.resolve(void 0);ot.then(function(t){return l(it,t)}).then(function(t){var e=rt.options.outFile;return e?void d.writeFileSync(e,t,{encoding:"utf8"}):void t.split("\n").forEach(function(t){return console.log(t)})}).catch(function(t){console.error(t.message)})}}}();