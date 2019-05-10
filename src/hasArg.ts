import * as minimist from 'minimist';

/**
 * Used to determine if a specific argument is present in the `args` object
 *
 * @private
 * @param {minimist.ParsedArgs|undefined} args
 * @param {string|undefined} argKey
 * @returns {boolean}
 */
export function hasArg(args: Partial<minimist.ParsedArgs>, argKey: string = ''): boolean {
    return typeof args !== 'undefined' && typeof args[argKey] !== 'undefined';
}
