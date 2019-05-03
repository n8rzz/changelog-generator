const util = require('util');
const exec = util.promisify(require('child_process').exec);
const chalk = require('chalk');
const options = require('../options/options');
const OptionsModel = require('../types/options.model');
const defaultOptions = require('../options/default-options');

async function _runCmd(cmd, defaultValue, errorMsg) {
    try {
        const { stdout, stderr } = await exec(cmd.toString());

        if (stderr.length > 0) {
            console.error(stderr);

            return '';
        }

        return stdout.trim();
    } catch (error) {
        console.log(chalk.yellow(`${errorMsg}, using default value`));

        return defaultValue;
    }
}

async function _extractUserEmail() {
    const cmd = 'git config user.email';
    const defaultValue = '';
    const errorMsg = 'An error occurred.  Oops, no biggie.';

    return _runCmd(cmd, defaultValue, errorMsg);
}

async function _extractUserName() {
    const cmd = 'git config user.name';
    const defaultValue = '';
    const errorMsg = 'An error occurred.  Oops, no biggie.';

    return _runCmd(cmd, defaultValue, errorMsg);
}

async function _extractMostRecentTag() {
    const cmd = 'git describe --tags \'git rev-list --tags --max-count=1\'';
    const defaultValue = '1.0.0';
    const errorMsg = 'An error occurred. Appears there are no tags present';

    return _runCmd(
        cmd,
        defaultValue,
        errorMsg
    );
}

async function _extractRemoteUrl() {
    const cmd = 'git remote get-url origin';
    const defaultValue = '';
    const errorMsg = 'An error occurred. Appears there isn\'t a git remote set.';
    const rawRemoteUrl = await _runCmd(cmd, defaultValue, errorMsg);

    return rawRemoteUrl.split('.git')[0];
}

async function initConfig(args) {
    const defaultConfig = defaultOptions;
    const email = await _extractUserEmail();
    const name = await _extractUserName();
    const lastTag = await _extractMostRecentTag();
    const remoteUrl = await _extractRemoteUrl();

    const config = OptionsModel.update(defaultConfig, {$merge: {
        email,
        name,
        lastTag,
        remoteUrl,
    }})

    // authorEmail: '${git config user.email}',
    // authorName: '${git config user.name}',
    // autoLinkIssue: true,
    // entriesDir: './changelog',
    // outputFilename: 'CHANGELOG',
    // lastTag: '${git describe --tags `git rev-list --tags --max-count=1`}',
    // originUrl: '',
    // projectName: ''

    options.writeConfig(config);
}

module.exports = initConfig;
