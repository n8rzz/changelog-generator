/**
 * Used to determine if a specific argument is present in the `args` object
 *
 * @private
 * @param {minimist.ParsedArgs} args
 * @param {string|undefined} argKey
 * @returns {boolean}
 */
function hasArgCommand(args, argCommandKey) {
    return typeof args !== 'undefined' && args._.indexOf(argCommandKey) !== -1;
}

module.exports = hasArgCommand;
