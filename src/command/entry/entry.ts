import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import minimist from 'minimist';
import path from 'path';
import CliCommandModel from '../../types/cli-arg.model';
import ConfigModel from '../../types/config.model';
import EntryModel from '../../types/entry.model';
import { execWithDefaultAndErrorMsg } from '../../execWithDefaultAndErrorMsg';
import { textInputValidator } from '../../validator/text-input.validator';
import { ENTRY_CLI_COMMAND_MAP } from './cli-command-map';

export default class EntryCommand {
    /**
     * Peer into current `git` configuration and
     * extract the current user's email address
     *
     * Will fallback to supplied `defaultValue`
     *
     * @method extractUserEmail
     * @returns {string}
     */
    public static async extractUserEmail(): Promise<string> {
        const cmd: string = 'git config user.email';
        const defaultValue: string = '';
        const errorMsg: string = 'An error occurred.  Oops, no biggie.';

        return execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);
    }

    /**
     * Peer into current `git` configuration and
     * extract the current user name
     *
     * Will fallback to supplied `defaultValue`
     *
     * @method extractUserName
     * @returns {string}
     */
    public static async extractUserName(): Promise<string> {
        const cmd: string = 'git config user.name';
        const defaultValue: string = '';
        const errorMsg: string = 'An error occurred.  Oops, no biggie.';

        return execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);
    }

    /**
     * Instantiate an `EntryModel` with default properties
     * and values extracted (or default) from `git` config
     *
     * @method extractInitialProps
     * @param {configModel} configModel
     * @returns {EntryModel}
     */
    public static async extractInitialProps(configModel: ConfigModel): Promise<EntryModel> {
        const email: string = await EntryCommand.extractUserEmail();
        const author: string = await EntryCommand.extractUserName();

        return new EntryModel({
            email,
            author,
            date: new Date().toUTCString(),
            issueSourceUrl: configModel.issueSourceUrl as string,
            skipFilenameCheck: false,
        });
    }

    /**
     * Pulls values passed from `cliArgs`
     *
     * Will grab a value based on either argument or alias
     *
     * @method extractEntryValuesFromCliArgs
     * @param {minimist.ParsedArgs} cliArgs
     * @returns {object}
     */
    public static extractEntryValuesFromCliArgs(cliArgs: minimist.ParsedArgs): Partial<EntryModel> {
        return Object.keys(ENTRY_CLI_COMMAND_MAP).reduce((
            sum: {[key: string]: string},
            cliOptionName: string,
        ): {[key: string]: string} => {
            const cliOption: CliCommandModel = ENTRY_CLI_COMMAND_MAP[cliOptionName];
            const argValue: string = cliOption.extractArgValueByCommandOrAlias(cliArgs) as string;

            if (argValue != null) {
                sum[cliOptionName] = argValue;
            }

            return sum;
        }, {});
    }

    /**
     * Setup questions for inquirer prompts, then present those
     * questions to the user
     *
     * @method promptEntryModelQuestions
     * @param {EntryModel} entryModelFlyweight
     * @param {ConfigModel} configModel
     * @returns {Promise<EntryModel>}
     */
    public static async promptEntryModelQuestions(
        entryModelFlyweight: EntryModel,
        configModel: ConfigModel,
    ): Promise<EntryModel> {
        const questions: inquirer.Questions = [
            {
                name: 'name',
                type: 'input',
                default: entryModelFlyweight.author,
                validate: textInputValidator,
            },
            {
                name: 'email',
                type: 'input',
                default: entryModelFlyweight.email,
                validate: textInputValidator,
            },
            {
                name: 'description',
                type: 'input',
                default: entryModelFlyweight.description,
                validate: textInputValidator,
            },
            {
                name: 'issue',
                type: 'input',
                default: entryModelFlyweight.issue,
                validate: textInputValidator,
            },
            {
                name: 'type',
                type: 'list',
                choices: configModel.entryType,
            },
        ];

        return inquirer.prompt(questions)
            .then((answers: inquirer.Answers): EntryModel => {
                return new EntryModel({
                    ...entryModelFlyweight,
                    ...answers,
                });
            });
    }

    /**
     * Checks `confifModel.entriesDir` to see if the file we're about to
     * write exists already in name or spirit.
     *
     * This function will return `false` when the filename about to be written:
     * - it finds a filename that exactly matches
     * - it finds a filename with the same `#issue` number
     *
     * A user can pass the `-f` flag to bypass this check and write the file anyway
     *
     * @method hasPossibleDuplicateEntry
     * @param {EntryModel} ntryModel
     * @returns {boolean}
     */
    public static hasPossibleDuplicateEntry(entryModel: EntryModel, configModel: ConfigModel): boolean {
        const entriesDir: string = path.join(process.cwd(), configModel.entriesDir);
        const entryFileName: string = entryModel.generateFileName();
        const files: string[] = fs.readdirSync(entriesDir);

        return files.some((filename: string): boolean => {
            return entryFileName === filename || filename.indexOf(entryModel.issue) > 0;
        });
    }

    /**
     * When a file exists with a similar name to the one about
     * to be created, render a warning to the user.
     *
     * When passed `-f`, render a message stating the file
     * was created, but may have been destructive
     *
     * @method renderSkipFilenameCheckMessage
     * @param {EntryModel} entryModel
     * @returns {void}
     */
    public static renderSkipFilenameCheckMessage(entryModel: EntryModel): void {
        if (!entryModel.skipFilenameCheck) {
            console.log(chalk.yellow(`\n* Verify the information for this entry is correct and try again with the ${chalk.white('-f')} option.`));

            return;
        }

        console.log(chalk.yellow(`* Similar filename found in entries directory. Generating new file anyway since ${chalk.white('-f')} flag was passed`));
    }

    /**
     * Attempt to write an `Entry` to a json file
     *
     * Provides feedback about writing a possible
     * duplicate entry before writing a file
     *
     * @method writeEntryFile
     * @param {EntryModel} entryModel
     * @param {ConfigModel} configModel
     */
    public static writeEntryFile(entryModel: EntryModel, configModel: ConfigModel): void {
        if (EntryCommand.hasPossibleDuplicateEntry(entryModel, configModel)) {
            console.log(chalk.grey(`\n* Attempted to write ${chalk.white(entryModel.generateFileName())}`));
            console.log(chalk.grey(`* A simlar filename already exists in '${chalk.white(configModel.entriesDir)}' directory.`));

            EntryCommand.renderSkipFilenameCheckMessage(entryModel);

            return;
        }

        const fileNameWithDirPath = path.join(configModel.entriesDir, entryModel.generateFileName());

        fs.writeFileSync(fileNameWithDirPath, JSON.stringify(entryModel, null, 2));

        console.log(chalk.grey(`
\n\nNew changelog entry: ${chalk.green(entryModel.generateFileName())} has been added to the entries directory: ${chalk.green(configModel.entriesDir)}. This file
should be added to version control. You can edit your entry file at any time.`));
    }

    /**
     * Gathers information about a changelog entry from:
     *
     * - system information like `git`
     * - config file (defaults to `.changelog.json`)
     * - cli input from when command was executed
     * - cli prompts created within this file
     *
     * After all the needed information has been gathered,
     * attempt to write a new file in the entries dir
     * (defaults to `.changelog/`)
     *
     * @public
     * @method entryCommand
     * @param {object|minimist.ParsedArgs} args
     * @param {ConfigModel} configModel
     */
    public static async execute(args: minimist.ParsedArgs, configModel: ConfigModel): Promise<void> {
        console.log(chalk.grey('Before we can generate a changelog entry, we need to ask a few questions...\n'));
        // gather as much as possible from default config, system props, and
        // cli args about the current state of things
        const initialProps = await EntryCommand.extractInitialProps(configModel);
        const valuesFromArgs: Partial<EntryModel> = EntryCommand.extractEntryValuesFromCliArgs(args);
        const entryModelFlyweight: EntryModel = new EntryModel({
            ...initialProps,
            ...valuesFromArgs,
        });
        const completeEntryModel: EntryModel = await EntryCommand.promptEntryModelQuestions(
            entryModelFlyweight,
            configModel,
        );

        EntryCommand.writeEntryFile(completeEntryModel, configModel);
    }
}
