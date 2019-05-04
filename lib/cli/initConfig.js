const chalk = require('chalk');
const { prompt } = require('inquirer');
const execWithDefaultAndErrorMsg = require('../execWithDefaultAndErrorMsg');
const OptionsModel = require('../types/options.model');
const InitConfigModel = require('../types/init-config.model');
const options = require('../options/options');
const defaultOptions = require('../options/default-options');

// async function _extractUserEmail() {
//     const cmd = 'git config user.email';
//     const defaultValue = '';
//     const errorMsg = 'An error occurred.  Oops, no biggie.';

//     return execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);
// }

// async function _extractUserName() {
//     const cmd = 'git config user.name';
//     const defaultValue = '';
//     const errorMsg = 'An error occurred.  Oops, no biggie.';

//     return execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);
// }

/**
 *
 *
 */
async function _extractMostRecentTag() {
    const cmd = 'git describe --tags \'git rev-list --tags --max-count=1\'';
    const defaultValue = '1.0.0';
    const errorMsg = 'An error occurred. Appears there are no tags present';

    return execWithDefaultAndErrorMsg(
        cmd,
        defaultValue,
        errorMsg
    );
}

/**
 *
 *
 */
async function _extractRemoteUrl() {
    const cmd = 'git remote get-url origin';
    const defaultValue = '';
    const errorMsg = 'An error occurred. Appears there isn\'t a git remote set.';
    const rawRemoteUrl = await execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);

    return rawRemoteUrl.split('.git')[0];
}

/**
 *
 *
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

function _finishInitWithUserAnswers(answers, config) {
    const answerModel = new InitConfigModel(answers);
    let currentOrReplacementTag = config.lastTag;

    if (!answerModel.isLastTagCorrect) {
        currentOrReplacementTag = '';
    }

    return OptionsModel.update(config, {$merge: {
        projectName: answerModel.projectName,
        lastTag: currentOrReplacementTag,
    }});
}

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
        .then((answers) => {
            const postAnswerMsg = `
    \nIf you would like to change configuration of this cli, you can modify the values defined in ${chalk.yellow(config.defaultConfigFilename)}
            `;
            console.log(chalk.bold.grey(postAnswerMsg));

           return _finishInitWithUserAnswers(answers, config);
        });
}

/**
 *
 *
 */
async function initConfig(args) {
    const config = await _extractConfigFromSystem();
    const finalConfig = await _promptInitQuestions(config);

    options.writeConfig(finalConfig);
}

module.exports = initConfig;
