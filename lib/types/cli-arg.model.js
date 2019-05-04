const t = require('tcomb');
const hasArg = require('../hasArg');

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
const CliCommandModel = t.struct({
    arg: t.String,
    alias: t.maybe(t.String),
}, 'CliCommandModel');

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
CliCommandModel.prototype.extractArgValueByCommandOrAlias = function extractArgValueByCommandOrAlias(args) {
    const hasArgument = hasArg(args, this.arg);
    const hasARgumentAlias = hasArg(args, this.alias);

    if (!hasArgument && !hasARgumentAlias) {
        return null;
    }

    if (hasArgument) {
        return args[this.arg];
    }

    return args[this.alias];
};

module.exports = CliCommandModel;
