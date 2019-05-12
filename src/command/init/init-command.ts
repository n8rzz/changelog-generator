import inquirer, { prompt } from 'inquirer';
import chalk from 'chalk';
import minimist from 'minimist';
import fs from 'fs';
import path from 'path';
import CliCommandModel from '../../types/cli-arg.model';
import ConfigModel from '../../types/config.model';
import {
    hasChangelogDir,
    writeConfig,
} from '../../config/config';
import { IInititialConfig } from './i-initial-config';
import { execWithDefaultAndErrorMsg } from '../../execWithDefaultAndErrorMsg';
import { textInputValidator } from '../../validator/text-input.validator';
import { defaultConfig } from '../../config/default-config';
import { INIT_CLI_COMMAND_MAP } from './cli-command-map';

export default class InitCommand {
    /**
     *
     * @param args
     */
    public static async execute(args: minimist.ParsedArgs): Promise<void> {
        const defaultConfigBeforeProps: IInititialConfig = {
            entriesDir: defaultConfig.entriesDir,
            projectName: '',
        };
        const initialProps: Partial<IInititialConfig> = await InitCommand._extractInitialProps(args);
        const config: IInititialConfig = {
            ...defaultConfigBeforeProps,
            ...initialProps,
        };

        InitCommand._initChangelogDir(config);
        await InitCommand._initConfig(config);
    }

    /**
     * Determine if the changelog entries dir exists
     *
     * In cases where the dir does not exist, call delegate
     * that will attempt to create it.
     *
     * _This dir is needed before any entries can be created_
     *
     * @method initChangelogDir
     * @param {Partial<ConfigModel>} configModel
     * @returns {void}
     */
    private static _initChangelogDir(config: IInititialConfig): void {
        if (hasChangelogDir()) {
            return;
        }

        console.log(chalk.grey('* Did not find an entries dir'));

        InitCommand._createChangelogEntriesDir(config.entriesDir);
    }

    /**
     * Starting from a `defaultConfig`, ask the user a few questions
     * about their project and save it all to a file
     *
     * @method _initConfig
     */
    private static async _initConfig(configFromArgValues: IInititialConfig): Promise<void> {
        console.log(chalk.grey('\n* No project configuration file found, generating default configuration...'));

        const configFromSystemValues: ConfigModel = await InitCommand._extractConfigFromSystem();
        const configWithArgAndSystemValues: ConfigModel = new ConfigModel({
            ...configFromSystemValues,
            ...configFromArgValues,
        });
        const finalConfig: ConfigModel = await InitCommand._promptInitQuestions(configWithArgAndSystemValues);

        writeConfig(finalConfig);
    }

    /**
     * @method _promptInitQuestions
     * @return
     */
    private static _promptInitQuestions(configWithSystemValues: ConfigModel): Promise<ConfigModel> {
        const questions = [
            {
                name: 'projectName',
                type: 'input',
                message: 'What is the name of your project?',
                default: configWithSystemValues.projectName,
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
            .then((answers: inquirer.Answers): ConfigModel => {
                return InitCommand._finishInitWithUserAnswers(answers, configWithSystemValues);
            });
    }

    /**
     * Given answers from the user, add those to the
     * `defaultConfig` and return a new `ConfigModel`
     *
     * @method _finishInitWithUserAnswers
     * @param initConfigProps {InitConfigModel}
     * @param configWithSystemValues {ConfigModel}
     * @return {ConfigModel}
     */
    private static _finishInitWithUserAnswers(
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
     * Starting from a `defaultConfig`, ask `git` for some additional
     * information and return a new config to be used elsewhere
     *
     * @method _extractConfigFromSystem
     * @return {ConfigModel}
     */
    private static async _extractConfigFromSystem(): Promise<ConfigModel> {
        const options = defaultConfig;
        const lastTag = await InitCommand._extractMostRecentTag();
        const issueSourceUrl = await InitCommand._extractIssueSourceUrl();

        return new ConfigModel({
            ...options,
            lastTag,
            issueSourceUrl,
        });
    }

    /**
     * Grab the remote url, if set
     *
     * _Used for auto-linking issues_
     *
     * @method _extractIssueSourceUrl
     * @return {string}  url to the `git` remote, less `.git` suffix
     */
    private static async _extractIssueSourceUrl(): Promise<string> {
        const cmd = 'git remote get-url origin';
        const defaultValue = '';
        const errorMsg = 'An error occurred. Appears there isn\'t a git remote set.';
        const rawIssueSourceUrl = await execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);

        return rawIssueSourceUrl.split('.git')[0];
    }

    /**
     * Ask `git` for the current tag, or use an empty string
     *
     * @method _extractMostRecentTag
     * @return {string}  current `git` tag or empty string
     */
    private static async _extractMostRecentTag(): Promise<string> {
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
     *
     * @param args
     */
    private static _createChangelogEntriesDir(entriesDir: string): void {
        const entriesDirWithDotPrefix: string = entriesDir.indexOf('.') !== 0
            ? `.${entriesDir}`
            : entriesDir;

        console.log(chalk.grey(
            '* Creating ',
            chalk.green(entriesDirWithDotPrefix),
            ' directory. This is where each changelog entry will be stored\n',
        ));

        fs.mkdirSync(path.join(process.cwd(), entriesDirWithDotPrefix));
    }

    /**
     *
     * @param args
     */
    private static async _extractInitialProps(args: minimist.ParsedArgs): Promise<Partial<ConfigModel>> {
        return Object.keys(INIT_CLI_COMMAND_MAP).reduce((
            sum: {[key: string]: string},
            cliOptionName: string,
        ): {[key: string]: string} => {
            const cliOption: CliCommandModel = INIT_CLI_COMMAND_MAP[cliOptionName];
            const argValue: string = cliOption.extractArgValueByCommandOrAlias(args) as string;

            if (argValue != null) {
                sum[cliOptionName] = argValue;
            }

            return sum;
        }, {});
    }
}
