import * as ts from 'typescript';

export type CompilerOptions = ts.CompilerOptions & { packOptions?: PackOptions };

export type MangleType = 'private' | 'export' | 'node' | 'default';

export enum Mangle {
    Private,
    Public,
    Default,
    Node,
};

export interface PackOptions {
    emitCustomHelpers?: boolean;
    wrapOutput?: string;

    mangleId?(fileName: string, id: string, mangle: MangleType): string;
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

function defaultMangleId(fileName: string, id: string, mangle: MangleType): string {
    let prefix: string;
    switch (mangle) {
        case 'private': prefix = 'prvt$'; break;
        case 'default': prefix = 'pblc$'; break;
        case 'export':  prefix = 'pblc$'; break;
        case 'node':    prefix = 'node$'; break;
    }

    const extIndex = fileName.lastIndexOf('.');
    const postfix = '$' + (extIndex >= 0 ? fileName.substr(0, fileName.lastIndexOf('.')) : fileName).replace(/[^a-z0-9]/gmi, '_');

    return prefix + id + postfix;
}
