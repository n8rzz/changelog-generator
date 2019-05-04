const chalk = require('chalk');
const { prompt } = require('inquirer');
const execWithDefaultAndErrorMsg = require('../execWithDefaultAndErrorMsg');
const textInputValidator = require('../validator/text-input.validator');
const ConfigModel = require('../types/config.model');
const InitConfigModel = require('../types/init-config.model');
const config = require('../config/config');
const defaultConfig = require('../config/default-config');

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
        errorMsg,
    );
}

/**
 * Grab the remote url, if set
 *
 * _Used for auto-linking issues_
 *
 * @function _extractIssueSourceUrl
 * @return {string}  url to the `git` remote, less `.git` suffix
 */
async function _extractIssueSourceUrl() {
    const cmd = 'git remote get-url origin';
    const defaultValue = '';
    const errorMsg = 'An error occurred. Appears there isn\'t a git remote set.';
    const rawIssueSourceUrl = await execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);

    return rawIssueSourceUrl.split('.git')[0];
}

/**
 * Starting from a `defaultConfig`, ask `git` for some additional
 * information and return a new config to be used elsewhere
 *
 * @function _extractConfigFromSystem
 * @return {ConfigModel}
 */
async function _extractConfigFromSystem() {
    const options = defaultConfig;
    const lastTag = await _extractMostRecentTag();
    const issueSourceUrl = await _extractIssueSourceUrl();
    const configWithSystemProps = ConfigModel.update(options, {
        $merge: {
            lastTag,
            issueSourceUrl,
        },
    });

    return configWithSystemProps;
}

/**
 * Given answers from the user, add those to the
 * `defaultConfig` and return a new `ConfigModel`
 *
 * @function _finishInitWithUserAnswers
 * @param initConfigProps {InitConfigModel}
 * @param configWithSystemValues {ConfigModel}
 * @return {ConfigModel}
 */
function _finishInitWithUserAnswers(initConfigAnswers, configWithSystemValues) {
    // eslint-disable-next-line
    const postAnswerMsg = `\n* If you want to change the config of this cli, you can modify config defined in ${configWithSystemValues.defaultConfigFilename}`;
    const answerModel = new InitConfigModel(initConfigAnswers);
    let currentOrReplacementTag = configWithSystemValues.lastTag;

    console.log(chalk.bold.grey(postAnswerMsg));

    if (!answerModel.isLastTagCorrect) {
        currentOrReplacementTag = '';
    }

    return ConfigModel.update(configWithSystemValues, {
        $merge: {
            projectName: answerModel.projectName,
            lastTag: currentOrReplacementTag,
        },
    });
}

/**
 * @function _promptInitQuestions
 * @return
 */
function _promptInitQuestions(configWithSystemValues) {
    const questions = [
        {
            name: 'projectName',
            type: 'input',
            message: 'What is the name of your project?',
            validate: textInputValidator,
        },
        {
            name: 'isLastTagCorrect',
            type: 'confirm',
            message: `Is ${chalk.green(configWithSystemValues.lastTag)} the most recent tag?`,
            default: true,
        },
    ];

    return prompt(questions)
        .then((answers) => _finishInitWithUserAnswers(answers, configWithSystemValues));
}

/**
 * Starting from a `defaultConfig`, ask the user a few questions
 * about their project and save it all to a file
 *
 * @function initConfig
 */
async function initConfig() {
    console.log(chalk.grey('\n* No project configuration file found, generating default configuration...'));

    const configWithSystemValues = await _extractConfigFromSystem();
    const finalConfig = await _promptInitQuestions(configWithSystemValues);

    config.writeConfig(finalConfig);
}

module.exports = initConfig;
