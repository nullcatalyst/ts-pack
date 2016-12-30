import * as tspoon from 'tspoon';

import debug             from '../visitors/debug';
import cacheVars         from '../visitors/cache-vars';
import cacheFuncs        from '../visitors/cache-funcs';
import cacheClasses      from '../visitors/cache-classes';
import defaultExports    from '../visitors/default-exports';
import loadExports       from '../visitors/load-exports';
import loadImports       from '../visitors/load-imports';
import changeImportProps from '../visitors/change-import-props';
import changeIds         from '../visitors/change-ids';
import removeExport      from '../visitors/remove-export';

const visitors: tspoon.Visitor[] = [
    // debug,
    cacheVars,
    cacheFuncs,
    cacheClasses,
    defaultExports,
    loadExports,
    loadImports,
    changeImportProps,
    changeIds,
    removeExport,
];

export default visitors;
