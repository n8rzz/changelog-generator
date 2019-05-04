const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');

/**
 * Abstraction for running a `cmd`, providing a default,
 * and displaying useful error messages when `cmd` results
 * in some sort of error.
 *
 * @param {string} cmd  shell command to execute
 * @param {any} defaultValue  value to return if the `cmd` results in an error
 * @param {string} errorMsg  msg to show the user when something goes wrong
 * @return {string}
 */
async function execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg) {
    try {
        const { stdout, stderr } = await exec(cmd.toString());

        if (stderr.length > 0) {
            console.error(stderr);

            return '';
        }

        return stdout.trim();
    } catch (error) {
        console.log(chalk.yellow(`${errorMsg}`));

        return defaultValue;
    }
}

module.exports = execWithDefaultAndErrorMsg;
