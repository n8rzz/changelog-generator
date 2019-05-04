const chalk = require('chalk');
const config = require('../config/config');

/**
 * Determine if the changelog entries dir exists
 *
 * In cases where the dir does not exist, call delegate
 * that will attempt to create it.
 *
 * _This dir is needed before any entries can be created_
 *
 * @function initChangelogDir
 * @returns {void}
 */
function initChangelogDir() {
    if (config.hasChangelogDir()) {
        return;
    }

    console.log(chalk.grey('* Did not find `./changelog` dir'));
    console.log(chalk.grey(
        '* Creating ',
        chalk.green('./changelog'),
        ' directory. This is where each changelog entry will be stored\n',
    ));

    config.createChangelogEntriesDir();
}

module.exports = initChangelogDir;
