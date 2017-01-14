import * as crypto from 'crypto';
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

    /** List of import names to exclude -- treat tham as a node module, and retain the import */
    excludeImports?: string[];

    hash?(source: string | ts.SourceFile): string;
    mangleId?(hash: string, id: string, mangle: Mangle, options?: CompilerOptions): string;
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

        if (!packOptions.hash)     packOptions.hash     = defaultHash;
        if (!packOptions.mangleId) packOptions.mangleId = defaultMangleId;
    } else {
        options.noEmitHelpers = true;
        packOptions = {
            emitCustomHelpers: true,
            hash: defaultHash,
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

function defaultHash(source: string | ts.SourceFile): string {
    if (typeof source === 'string') {
        const extIndex = source.lastIndexOf('.');
        return (extIndex >= 0 ? source.substr(0, extIndex) : source).replace(/[^a-z0-9]/gmi, '_');
    } else {
        // Hash the source contents using the SHA-1 hash algorithm
        return crypto
            .createHash('sha1')
            .update(source.getText(), 'utf8')
            .digest('hex');
    }
}

function defaultMangleId(hash: string, id: string, mangle: Mangle, options?: CompilerOptions): string {
    if (options && options.packOptions && options.packOptions.alias) {
        if (id in options.packOptions.alias) {
            return options.packOptions.alias[id];
        }
    }

    let postfix: string;
    switch (mangle) {
        case Mangle.Internal:         postfix = '$i$'; break;
        case Mangle.Export:           // fallthrough;
        case Mangle.DefaultExport:    postfix = '$x$'; break;
        case Mangle.NodeModuleImport: postfix = '$n$'; break;
    }

    postfix += hash.replace(/[^a-z0-9]/gmi, '_');

    return id + postfix;
}
