import get from 'lodash.get';
import minimist from 'minimist';
import { CommandEnum } from './types/command.enum';

/**
 * Used to determine if a specific argument is present in the `args` object
 *
 * @private
 * @param {minimist.ParsedArgs} args
 * @param {string|undefined} argKey
 * @returns {boolean}
 */
export function hasArgCommand(args: Partial<minimist.ParsedArgs>, argCommandKey: CommandEnum): boolean {
    const commands: string[] = get(args, '_', []);

    return typeof args !== 'undefined'
        && commands.indexOf(argCommandKey) !== -1;
}
