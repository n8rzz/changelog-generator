import minimist from 'minimist';
import { hasArg } from '../hasArg';

export interface ICliCommand {
    arg: string;
    alias?: string;
}
/**
 * Defines a command's argument or alias
 *
 * Example:
 * Given a command named issue
 *
 * An `arg` would be used with a double `-`: `--issue`
 * An `alias` would be used with a single `-`: `-i`
 *
 * @type CliCommandModel
 */
export default class CliCommandModel implements ICliCommand {
    public arg: string = '';
    public alias: string = '';

    constructor(props: ICliCommand) {
        this.arg = props.arg;
        this.alias = props.alias || '';
    }

    /**
     * Given cli arguments, extract values for `this` command.
     *
     * Useful when looping through avaible args for a given command,
     * will return `null` or the value passed via `cli`
     *
     * @method extractArgValueByCommandOrAlias
     * @param args {object}
     * @returns {string|null}
     */
    public extractArgValueByCommandOrAlias(args: Partial<minimist.ParsedArgs>): string|null {
        const hasArgument = hasArg(args, this.arg);
        const hasARgumentAlias = hasArg(args, this.alias);

        if (!hasArgument && !hasARgumentAlias) {
            return null;
        }

        if (hasArgument) {
            return args[this.arg];
        }

        return args[this.alias];
    }
}
