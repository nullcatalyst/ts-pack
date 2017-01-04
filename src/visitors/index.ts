import * as tspoon from '../tspoon';

import debug             from '../visitors/debug';
import cacheVars         from '../visitors/cache-vars';
import cacheFuncs        from '../visitors/cache-funcs';
import cacheClasses      from '../visitors/cache-classes';
import exportDefault     from '../visitors/export-default';
import exportExpression  from '../visitors/export-expression';
import exportFromModule  from '../visitors/export-from-module';
import importFromModule  from '../visitors/import-from-module';
import changeImportProps from '../visitors/change-import-props';
import changeIds         from '../visitors/change-ids';
import removeExport      from '../visitors/remove-export';

const visitors: tspoon.Visitor[] = [
    // debug,
    cacheVars,
    cacheFuncs,
    cacheClasses,
    exportDefault,
    exportExpression,
    exportFromModule,
    importFromModule,
    changeImportProps,
    changeIds,
    removeExport,
];

export default visitors;
