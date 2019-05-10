import util from 'util';
import chalk from 'chalk';
import { exec } from 'child_process';

const execAsync = util.promisify(exec);

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
export async function execWithDefaultAndErrorMsg(
    cmd: string,
    defaultValue: string,
    errorMsg: string,
): Promise<string> {
    try {
        const { stdout, stderr } = await execAsync(cmd.toString());

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
