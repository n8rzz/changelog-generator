const chalk = require('chalk');
const { prompt } = require('inquirer');
const execWithDefaultAndErrorMsg = require('../execWithDefaultAndErrorMsg');
const OptionsModel = require('../types/options.model');
const InitConfigModel = require('../types/init-config.model');
const options = require('../options/options');
const defaultOptions = require('../options/default-options');

/**
 * Ask `git` for the current tag, or use an empty string
 *
 * @function _extractMostRecentTag
 * @return {string}  current `git` tag or empty string
 */
async function _extractMostRecentTag() {
    const cmd = 'git describe --tags \'git rev-list --tags --max-count=1\'';
    const defaultValue = '1.0.0';
    const errorMsg = '';

    return execWithDefaultAndErrorMsg(
        cmd,
        defaultValue,
        errorMsg
    );
}

/**
 * Grab the remote url, if set
 *
 * _Used for auto-linking issues_
 *
 * @function _extractRemoteUrl
 * @return {string}  url to the `git` remote, less `.git` suffix
 */
async function _extractRemoteUrl() {
    const cmd = 'git remote get-url origin';
    const defaultValue = '';
    const errorMsg = 'An error occurred. Appears there isn\'t a git remote set.';
    const rawRemoteUrl = await execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);

    return rawRemoteUrl.split('.git')[0];
}

/**
 * Starting from a `defaultConfig`, ask `git` for some additional
 * information and return a new config to be used elsewhere
 *
 *
 * @function _extractConfigFromSystem
 * @return {OptionsModel}
 */
async function _extractConfigFromSystem() {
    const defaultConfig = defaultOptions;
    const lastTag = await _extractMostRecentTag();
    const remoteUrl = await _extractRemoteUrl();
    const config = OptionsModel.update(defaultConfig, {$merge: {
        lastTag,
        remoteUrl,
    }});

    return config;
}

/**
 * Given answers from the user, add those to the
 * `defaultConfig` and return a new `OptionsModel`
 *
 * @function _finishInitWithUserAnswers
 * @param initConfigProps {InitConfigModel}
 * @param config {OptionsModel}
 * @return {OptionsModel}
 */
function _finishInitWithUserAnswers(initConfigProps, config) {
    const postAnswerMsg = `
    \nIf you would like to change configuration of this cli, you can modify the values defined in ${chalk.yellow(config.defaultConfigFilename)}
    `;
    const answerModel = new InitConfigModel(initConfigProps);
    let currentOrReplacementTag = config.lastTag;

    console.log(chalk.bold.grey(postAnswerMsg));

    if (!answerModel.isLastTagCorrect) {
        currentOrReplacementTag = '';
    }

    return OptionsModel.update(config, {$merge: {
        projectName: answerModel.projectName,
        lastTag: currentOrReplacementTag,
    }});
}

/**
 *
 * @function _promptInitQuestions
 * @return
 */
function _promptInitQuestions(config) {
    const questions = [
        {
            name: 'projectName',
            type: 'input',
            message: 'What is the name of your project?'
        },
        {
            name: 'isLastTagCorrect',
            type: 'confirm',
            message: `Is ${chalk.green(config.lastTag)} the most recent tag?`,
            default: true
        }
    ];

    return prompt(questions)
        .then((answers) => _finishInitWithUserAnswers(answers, config));
}

/**
 * Starting from a `defaultConfig`, ask the user a few questions
 * about their project and save it all to a file
 *
 * @function initConfig
 */
async function initConfig() {
    const config = await _extractConfigFromSystem();
    const finalConfig = await _promptInitQuestions(config);

    options.writeConfig(finalConfig);
}

module.exports = initConfig;
