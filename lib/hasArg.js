/**
 * Used to determine if a specific argument
 * is present in the `args` object
 *
 * @private
 * @param {minimist.ParsedArgs} args
 * @param {string|undefined} argKey
 * @returns {boolean}
 */
function hasArg(args, argKey) {
    return args && typeof args[argKey] !== 'undefined';
};

module.exports = hasArg;
