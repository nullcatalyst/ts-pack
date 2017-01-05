import * as ts from 'typescript';

export type CompilerOptions = ts.CompilerOptions & { packOptions?: PackOptions };

export const enum Mangle {
    Internal,
    Export,
    DefaultExport,
    NodeModuleImport,
};

export interface PackOptions {
    emitCustomHelpers?: boolean;
    wrapOutput?: string;

    /** Alias or preserve specific identifier names. USE WITH CARE. */
    alias?: { [id: string]: string };

    mangleId?(fileName: string, id: string, mangle: Mangle, options?: CompilerOptions): string;
}

/**
 * This sets any custom default options for our own internal use.
 */
export function setDefaultOptions(options?: ts.CompilerOptions, packOptions?: PackOptions): CompilerOptions {
    options = options || {};
    packOptions = packOptions || (options as CompilerOptions).packOptions;

    // Handle any conflicting options
    if (packOptions) {
        if (packOptions.emitCustomHelpers) {
            // In order to prevent the typescript compiler outputting the helper functions multiple times,
            // we tell the compiler not to emit the helpers, and we will include them ourselves.
            options.noEmitHelpers = true;
        }

        if (!packOptions.mangleId) {
            packOptions.mangleId = defaultMangleId;
        }
    } else {
        options.noEmitHelpers = true;
        packOptions = {
            emitCustomHelpers: true,
            mangleId: defaultMangleId,
        };
    }

    return Object.assign(options, { packOptions });
}

/**
 * Clone the passed in options, then remove any of the additional custom options that we have added.
 * If we were to pass in all of our own options, the typescript compiler woulf throw an error.
 */
export function cloneTypescriptOptions(options: CompilerOptions): ts.CompilerOptions {
    const tsOptions = Object.assign({}, options);
    delete tsOptions.packOptions;
    return tsOptions;
}

function defaultMangleId(fileName: string, id: string, mangle: Mangle, options?: CompilerOptions): string {
    if (options && options.packOptions && options.packOptions.alias) {
        if (id in options.packOptions.alias) {
            return options.packOptions.alias[id];
        }
    }

    let prefix: string;
    switch (mangle) {
        case Mangle.Internal:         prefix = 'prvt$'; break;
        case Mangle.Export:           // fallthrough;
        case Mangle.DefaultExport:    prefix = 'pblc$'; break;
        case Mangle.NodeModuleImport: prefix = 'node$'; break;
    }

    const extIndex = fileName.lastIndexOf('.');
    const postfix = '$' + (extIndex >= 0 ? fileName.substr(0, fileName.lastIndexOf('.')) : fileName).replace(/[^a-z0-9]/gmi, '_');

    // If the first letter is an uppercase, keep it as an uppercase
    // This avoids some issues when using this transpiler with React
    if (id && id[0] === id[0].toUpperCase()) {
        prefix = prefix[0].toUpperCase() + prefix.slice(1);
    }

    return prefix + id + postfix;
}
