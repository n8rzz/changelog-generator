import fs from 'fs';
import groupBy from 'lodash.groupby';
import inquirer from 'inquirer';
import minimist from 'minimist';
import path from 'path';
import sortBy from 'lodash.sortby';
import CliCommandModel from '../../types/cli-arg.model';
import ConfigModel from '../../types/config.model';
import ChangelogModel from './changelog.model';
import EntryModel, { IEntryModel } from '../entry/entry.model';
import { IChangelog } from './i-changelog';
import { IEntryGroup } from './i-entry-group';
import { IKeyString } from '../../types/i-key-string';
import { readFileAsync } from '../../read-file-async';
import { textInputValidator } from '../../validator/text-input.validator';
import { GENERATE_CLI_COMMAND_MAP } from './cli-command-map';

/**
 * Used to compile existing entries and write a new
 * (or add to existing) changelog file
 *
 * - grab each entry in `.changelog` dir
 * - present user with questions about file to write
 * - write file with entry, grouped by `entry.type`
 * - remove entry files used to generate file
 *
 * @class GenerateCommand
 */
export default class GenerateCommand {
    /**
     * Entry point for `generate` command
     *
     * Should only be called when `generate` command has been
     * passed via cli
     *
     * @public
     * @static
     * @async
     * @method execute
     * @param args {minimist.ParsedArgs}
     * @param config {ConfigModel}
     * @returns {Promise<void>}
     */
    public static async execute(args: minimist.ParsedArgs, config: ConfigModel): Promise<void> {
        console.log('args', args);
        console.log('\n\nconfig', config);
        console.log('\n\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n\n');

        const preparedChangelog: ChangelogModel = await GenerateCommand._prepareChangelog(args, config);
        console.log('\n---: preparedChangelog ', preparedChangelog, '\n\n', preparedChangelog.entries);

        // # convert json -> md
        // # read existing CHANGELOG
        // # append existing changelog to release
        // # write CHANGELOG
        // # SUCCESS feedback
        // # remove entry files
        // # SUCCESS feedback

        return Promise.resolve();
    }

    /**
     * Pulls values passed from `cliArgs`
     *
     * Will grab a value based on either argument or alias
     *
     * @public
     * @static
     * @method extractEntryValuesFromCliArgs
     * @param args {minimist.ParsedArgs}
     * @returns Partial<IChangelog>
     */
    public static extractEntryValuesFromCliArgs(args: minimist.ParsedArgs): Partial<IChangelog> {
        return Object.keys(GENERATE_CLI_COMMAND_MAP).reduce((
            sum: IKeyString,
            cliOptionName: string,
        ): IKeyString => {
            const cliOption: CliCommandModel = GENERATE_CLI_COMMAND_MAP[cliOptionName];
            const argValue: string = cliOption.extractArgValueByCommandOrAlias(args) as string;

            if (argValue != null) {
                sum[cliOptionName] = argValue;
            }

            return sum;
        }, {});
    }

    /**
     * Presents user with `inquirer` questions about changelog
     * to be created, and entries to be included
     *
     * @public
     * @static
     * @async
     * @method promptChangelogQuestions
     * @param argValues {Partial<IChangelog>}
     * @param entryList {EntryModel[]}
     * @returns Promise<ChangelogModel>
     */
    public static async promptChangelogQuestions(
        argValues: Partial<IChangelog>,
        entryList: EntryModel[],
    ): Promise<ChangelogModel> {
        const versionOrBlank: string = argValues.version || '';
        const entryCheckboxList: string[] = GenerateCommand._buildEntryCheckboxChoicesList(entryList);
        const questions: inquirer.Questions = [
            {
                name: 'version',
                type: 'input',
                default: versionOrBlank,
                validate: textInputValidator,
            },
            {
                name: 'entries',
                type: 'checkbox',
                choices: entryCheckboxList,
            },
        ];

        return inquirer.prompt(questions)
            .then((answers: inquirer.Answers): ChangelogModel => {
                return new ChangelogModel(
                    answers,
                    entryList,
                );
            });
    }

    /**
     * Builds a list of checkboxes for use with `inquirer` with
     * entries grouped by `#type`
     *
     * @private
     * @static
     * @method _buildEntryCheckboxChoicesList
     * @param entryList {EntryModel[]}
     * @returns {string[]}
     */
    private static _buildEntryCheckboxChoicesList(entryList: EntryModel[]): string[] {
        const sortedEntryGroup: IEntryGroup = GenerateCommand._groupAndSortEntryListByType(entryList);

        return Object.keys(sortedEntryGroup).reduce((sum: string[], groupName: string): string[] => {
            const separator: string = `--- ${groupName.toUpperCase()} ---`;
            const checkboxEntriesForGroup: string[] = sortedEntryGroup[groupName].map(
                (entryModel: EntryModel): string => {
                    return entryModel.buildCheckboxLabel();
                },
            );

            sum.push(
                new inquirer.Separator(separator) as any,
            );

            return [
                ...sum,
                ...checkboxEntriesForGroup,
            ];
        }, [] as string[]);
    }

    /**
     * @private
     * @static
     * @async
     * @method _buildEntryList
     * @param configModel {ConfigModel}
     * @returns {Promise<EntryModel[]>}
     */
    private static async _buildEntryList(configModel: ConfigModel): Promise<EntryModel[]> {
        const entriesDir = path.join(process.cwd(), configModel.entriesDir);
        const fileNames = fs.readdirSync(entriesDir);

        return Promise.all(fileNames.map(async (fileName: string): Promise<EntryModel> => {
            const fielNameWithoutExtension = fileName.split('.json')[0];
            const rawEntry: string = await readFileAsync(path.join(entriesDir, fileName));
            // `rawEntry` is going to be a Buffer, using `JSON.parse()` to translate to an object
            const entryModelProps: IEntryModel = {
                ...JSON.parse(rawEntry),
                name: fielNameWithoutExtension,
            };

            return new EntryModel(entryModelProps);
        }));
    }

    /**
     * @private
     * @static
     * @method _groupAndSortEntryListByType
     * @param entryList {EntryModel[]}
     * @returns {IEntryGroup}
     */
    private static _groupAndSortEntryListByType(entryList: EntryModel[]): IEntryGroup {
        const groupedEntrylist: IEntryGroup = groupBy(entryList, 'type');

        return Object.keys(groupedEntrylist).reduce((sum: IEntryGroup, groupKey: string): IEntryGroup => {
            sum[groupKey] = sortBy(groupedEntrylist[groupKey], ['date']);

            return sum;
        }, {} as IEntryGroup);
    }

    /**
     * Assembles `cli` arg values and `EntryModel`s before
     * prompting user with `inquirer` questions
     *
     * @private
     * @static
     * @async
     * @method _prepareChangelog
     * @param args {minimist.ParsedArgs}
     * @param config {ConfigModel}
     * @returns {Promise<ChangelogModel>}
     */
    private static async _prepareChangelog(args: minimist.ParsedArgs, config: ConfigModel): Promise<ChangelogModel> {
        const argValues: Partial<IChangelog> = GenerateCommand.extractEntryValuesFromCliArgs(args);
        const entryList: EntryModel[] = await GenerateCommand._buildEntryList(config);

        return GenerateCommand.promptChangelogQuestions(argValues, entryList);
    }
}
