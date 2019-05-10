const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { prompt } = require('inquirer');
const execWithDefaultAndErrorMsg = require('../../execWithDefaultAndErrorMsg');
const EntryModel = require('../../types/entry.model');
const textInputValidator = require('../../validator/text-input.validator');
const ENTRY_CLI_COMMAND_MAP = require('./command-map');

/**
 * Peer into current `git` configuration and
 * extract the current user's email address
 *
 * Will fallback to supplied `defaultValue`
 *
 * @function extractUserEmail
 * @returns {string}
 */
async function extractUserEmail() {
    const cmd = 'git config user.email';
    const defaultValue = '';
    const errorMsg = 'An error occurred.  Oops, no biggie.';

    return execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);
}

/**
 * Peer into current `git` configuration and
 * extract the current user name
 *
 * Will fallback to supplied `defaultValue`
 *
 * @function extractUserName
 * @returns {string}
 */
async function extractUserName() {
    const cmd = 'git config user.name';
    const defaultValue = '';
    const errorMsg = 'An error occurred.  Oops, no biggie.';

    return execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);
}

/**
 * Instantiate an `EntryModel` with default properties
 * and values extracted (or default) from `git` config
 *
 * @function extractInitialProps
 * @param {configModel} configModel
 * @returns {EntryModel}
 */
async function extractInitialProps(configModel) {
    const email = await extractUserEmail();
    const author = await extractUserName();

    return new EntryModel({
        email,
        author,
        date: new Date().toUTCString(),
        issueSourceUrl: configModel.issueSourceUrl,
        skipFilenameCheck: false,
    });
}

/**
 * Pulls values passed from `cliArgs`
 *
 * Will grab a value based on either argument or alias
 *
 * @function extractEntryValuesFromCliArgs
 * @param {minimist.ParsedArgs} cliArgs
 * @returns {object}
 */
function extractEntryValuesFromCliArgs(cliArgs) {
    return Object.keys(ENTRY_CLI_COMMAND_MAP).reduce((sum, cliOptionName) => {
        const cliOption = ENTRY_CLI_COMMAND_MAP[cliOptionName];
        const argValue = cliOption.extractArgValueByCommandOrAlias(cliArgs);

        if (argValue != null) {
            sum[cliOptionName] = argValue;
        }

        return sum;
    }, {});
}

/**
 * Accepts answers from inquirer prompts and combines those
 * with extracted systems props and any cli values passed
 *
 * The model returned here is what will be used to
 * write an entry file
 *
 * @function finalizeEntryModel
 * @param {object} answers  ansers from inquirer questions
 * @param {EntryModel} entryModel
 * @returns {EntryModel}
 */
function finalizeEntryModel(answers, entryModel) {
    return EntryModel.update(entryModel, {
        $merge: {
            ...answers,
        },
    });
}

/**
 * Setup questions for inquirer prompts, then present those
 * questions to the user
 *
 * @function promptEntryModelQuestions
 * @param {entryProps} entryProps
 * @param {ConfigModel} configModel
 * @returns {Promise<EntryModel>}
 */
async function promptEntryModelQuestions(entryProps, configModel) {
    const questions = [
        {
            name: 'name',
            type: 'input',
            default: entryProps.author,
            validate: textInputValidator,
        },
        {
            name: 'email',
            type: 'input',
            default: entryProps.email,
            validate: textInputValidator,
        },
        {
            name: 'description',
            type: 'input',
            default: entryProps.description,
            validate: textInputValidator,
        },
        {
            name: 'issue',
            type: 'input',
            default: entryProps.issue,
            validate: textInputValidator,
        },
        {
            name: 'type',
            type: 'list',
            choices: configModel.entryType,
        },
    ];

    return prompt(questions)
        .then((answers) => finalizeEntryModel(answers, entryProps));
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
 * @function hasPossibleDuplicateEntry
 * @param {EntryModel} completeEntryModel
 * @returns {boolean}
 */
function hasPossibleDuplicateEntry(completeEntryModel, configModel) {
    const { issue } = completeEntryModel;
    const entriesDir = path.join(process.cwd(), configModel.entriesDir);
    const files = fs.readdirSync(entriesDir);
    const entryFileName = completeEntryModel.generateFileName();

    return files.some((filename) => entryFileName === filename || filename.indexOf(issue) > 0);
}

/**
 * When a file exists with a similar name to the one about
 * to be created, render a warning to the user.
 *
 * When passed `-f`, render a message stating the file
 * was created, but may have been destructive
 *
 * @function renderSkipFilenameCheckMessage
 * @param {EntryModel} completeEntryModel
 * @returns {void}
 */
function renderSkipFilenameCheckMessage(completeEntryModel) {
    if (!completeEntryModel.skipFilenameCheck) {
        // eslint-disable-next-line max-len
        console.log(chalk.yellow(`\n* Verify the information for this entry is correct and try again with the ${chalk.white('-f')} option.`));

        return;
    }

    // eslint-disable-next-line max-len
    console.log(chalk.yellow(`* Similar filename found in entries directory. Generating new file anyway since ${chalk.white('-f')} flag was passed`));
}

/**
 * Attempt to write an `Entry` to a json file
 *
 * Provides feedback about writing a possible
 * duplicate entry before writing a file
 *
 * @function writeEntryFile
 * @param {EntryModel} completeEntryModel
 * @param {ConfigModel} configModel
 */
function writeEntryFile(completeEntryModel, configModel) {
    if (hasPossibleDuplicateEntry(completeEntryModel, configModel)) {
        console.log(chalk.grey(`\n* Attempted to write ${chalk.white(completeEntryModel.generateFileName())}`));
        // eslint-disable-next-line max-len
        console.log(chalk.grey(`* A simlar filename already exists in '${chalk.white(configModel.entriesDir)}' directory.`));

        renderSkipFilenameCheckMessage(completeEntryModel);

        return;
    }

    const fileNameWithDirPath = path.join(configModel.entriesDir, completeEntryModel.generateFileName());

    fs.writeFileSync(fileNameWithDirPath, JSON.stringify(completeEntryModel, null, 2));

    // eslint-disable-next-line max-len
    console.log(chalk.grey(`
\n\nNew changelog entry: ${chalk.green(completeEntryModel.generateFileName())} has been added to the entries
directory: ${chalk.green(configModel.entriesDir)}. This file should be added to version control. You can
edit your entry file at any time.
    `));
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
 * @function entryCommand
 * @param {object|minimist.ParsedArgs} args
 * @param {ConfigModel} configModel
 */
async function entryCommand(args, configModel) {
    console.log(chalk.grey('Before we can generate a changelog entry, we need to ask a few questions...\n'));
    // gather as much as possible from default config, system props, and
    // cli args about the current state of things
    const initialProps = await extractInitialProps(configModel);
    const entryProps = EntryModel.update(initialProps, {
        $merge: {
            ...extractEntryValuesFromCliArgs(args),
        },
    });

    const completeEntryModel = await promptEntryModelQuestions(entryProps, configModel);

    writeEntryFile(completeEntryModel, configModel);
}

module.exports = {
    extractUserEmail,
    extractUserName,
    extractInitialProps,
    extractEntryValuesFromCliArgs,
    finalizeEntryModel,
    promptEntryModelQuestions,
    hasPossibleDuplicateEntry,
    renderSkipFilenameCheckMessage,
    writeEntryFile,
    entryCommand,
};
