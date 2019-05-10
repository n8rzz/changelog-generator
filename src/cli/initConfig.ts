import chalk from 'chalk';
import inquirer, { prompt } from 'inquirer';
import ConfigModel from '../types/config.model';
import { execWithDefaultAndErrorMsg } from '../execWithDefaultAndErrorMsg';
import { textInputValidator } from '../validator/text-input.validator';
import { writeConfig } from '../config/config';
import { defaultConfig } from '../config/default-config';

/**
 * Ask `git` for the current tag, or use an empty string
 *
 * @function _extractMostRecentTag
 * @return {string}  current `git` tag or empty string
 */
export async function _extractMostRecentTag(): Promise<string> {
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
export async function _extractIssueSourceUrl(): Promise<string> {
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
export async function _extractConfigFromSystem(): Promise<ConfigModel> {
    const options = defaultConfig;
    const lastTag = await _extractMostRecentTag();
    const issueSourceUrl = await _extractIssueSourceUrl();

    return new ConfigModel({
        ...options,
        lastTag,
        issueSourceUrl,
    });
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
function _finishInitWithUserAnswers(
    initConfigAnswers: any,
    configWithSystemValues: ConfigModel,
): ConfigModel {
    // eslint-disable-next-line
    const postAnswerMsg: string = `\n* If you want to change the config of this cli, you can modify config defined in ${configWithSystemValues.defaultConfigFilename}`;
    let currentOrReplacementTag: string = configWithSystemValues.lastTag;

    console.log(chalk.bold.grey(postAnswerMsg));

    if (!initConfigAnswers.isLastTagCorrect) {
        currentOrReplacementTag = '';
    }

    return new ConfigModel({
        ...configWithSystemValues,
        projectName: initConfigAnswers.projectName,
        lastTag: currentOrReplacementTag,
    });
}

/**
 * @function _promptInitQuestions
 * @return
 */
export function _promptInitQuestions(configWithSystemValues: ConfigModel): Promise<ConfigModel> {
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
        .then((answers: inquirer.Answers) => _finishInitWithUserAnswers(answers, configWithSystemValues));
}

/**
 * Starting from a `defaultConfig`, ask the user a few questions
 * about their project and save it all to a file
 *
 * @function initConfig
 */
export async function initConfig(): Promise<void> {
    console.log(chalk.grey('\n* No project configuration file found, generating default configuration...'));

    const configWithSystemValues: ConfigModel = await _extractConfigFromSystem();
    const finalConfig: ConfigModel = await _promptInitQuestions(configWithSystemValues);

    writeConfig(finalConfig);
}
