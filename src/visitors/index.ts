import debug             from '../visitors/debug';
import loadImports       from '../visitors/load-imports';
import loadExports       from '../visitors/load-exports';
import cacheVars         from '../visitors/cache-vars';
import cacheFuncs        from '../visitors/cache-funcs';
import cacheClasses      from '../visitors/cache-classes';
import changeImportProps from '../visitors/change-import-props';
import changeIds         from '../visitors/change-ids';
import removeExport      from '../visitors/remove-export';

const visitors = [
    // debug,
    loadImports,
    loadExports,
    cacheVars,
    cacheFuncs,
    cacheClasses,
    changeImportProps,
    changeIds,
    removeExport,
];

export default visitors;
