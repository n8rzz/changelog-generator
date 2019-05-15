import fs from 'fs';
import groupBy from 'lodash.groupby';
import inquirer from 'inquirer';
import minimist from 'minimist';
import path from 'path';
import sortBy from 'lodash.sortby';
import CliCommandModel from '../../types/cli-arg.model';
import ConfigModel from '../../types/config.model';
import EntryModel, { IEntryModel } from '../entry/entry.model';
import { IKeyString } from '../../types/i-key-string';
import { readFileAsync } from '../../read-file-async';
import { textInputValidator } from '../../validator/text-input.validator';
import { GENERATE_CLI_COMMAND_MAP } from './cli-command-map';

export interface IEntryGroup {
    [key: string]: EntryModel[];
}

export interface IChangelog {
    version: string;
    date: Date;
    entries: IEntryGroup;
}

export default class GenerateCommand {
    /**
     *
     *
     * @param args
     * @param config
     */
    public static async execute(args: minimist.ParsedArgs, config: ConfigModel): Promise<void> {
        console.log('args', args);
        console.log('\n\nconfig', config);
        console.log('\n\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n\n');

        const entryList: EntryModel[] = await GenerateCommand.buildEntryList(config);
        const argValues: Partial<IChangelog> = GenerateCommand.extractEntryValuesFromCliArgs(args);
        const preparedChangelog = await GenerateCommand.promptChangelogQuestions(argValues, entryList);

        console.log('\n---: preparedChangelog ', preparedChangelog, preparedChangelog.entries);

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
     *
     *
     * @param configModel
     * @returns {Promise<EntryModel[]>}
     */
    public static async buildEntryList(configModel: ConfigModel): Promise<EntryModel[]> {
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
     * Pulls values passed from `cliArgs`
     *
     * Will grab a value based on either argument or alias
     *
     * @method extractEntryValuesFromCliArgs
     * @param {minimist.ParsedArgs} args
     * @returns {object}
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
     *
     *
     * @param argValues
     * @param entryList
     */
    public static async promptChangelogQuestions(
        argValues: Partial<IChangelog>,
        entryList: EntryModel[],
    ): Promise<IChangelog> {
        const versionOrBlank: string = argValues.version || '';
        const sortedEntryGroup: IEntryGroup = GenerateCommand._groupAndSortEntryListByType(entryList);
        const entryCheckboxList: string[] = GenerateCommand._buildEntryCheckboxChoicesList(sortedEntryGroup);
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
            .then((answers: inquirer.Answers): IChangelog => {
                const rawChangelog: Partial<IChangelog> = {
                    date: new Date(),
                    version: answers.version,
                };

                return GenerateCommand.buildChangelogFromAnswers(
                    rawChangelog,
                    answers.entries as string[],
                    entryList,
                    sortedEntryGroup,
                );
            });
    }

    /**
     *
     *
     *
     */
    private static _buildEntryCheckboxChoicesList(sortedEntryGroup: IEntryGroup): string[] {
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
     *
     *
     *
     */
    public static buildChangelogFromAnswers(
        rawChangelog: Partial<IChangelog>,
        rawEntrySelections: string[],
        entryList: EntryModel[],
        sortedEntryGroup: IEntryGroup,
    ): IChangelog {
        if (rawEntrySelections.length === entryList.length) {
            return {
                ...rawChangelog,
                entries: sortedEntryGroup,
            } as IChangelog;
        }

        return GenerateCommand._updateEntryGroupWithUserSelections(
            rawChangelog,
            rawEntrySelections,
            entryList,
        );
    }

    /**
     *
     *
     * @param entryList
     */
    private static _groupAndSortEntryListByType(entryList: EntryModel[]): IEntryGroup {
        const groupedEntrylist: IEntryGroup = groupBy(entryList, 'type');

        return Object.keys(groupedEntrylist).reduce((sum: any, groupKey: string): any => {
            sum[groupKey] = sortBy(groupedEntrylist[groupKey], ['date']);

            return sum;
        }, {} as IEntryGroup);
    }

    /**
     *
     *
     *
     */
    private static _updateEntryGroupWithUserSelections(
        rawChangelog: Partial<IChangelog>,
        rawEntrySelections: string[],
        entryList: EntryModel[],
    ): IChangelog {
        const trimmedEntryList: EntryModel[] = entryList.filter((entryModel: EntryModel): boolean => {
            return rawEntrySelections.indexOf(entryModel.buildCheckboxLabel()) !== -1;
        });

        return {
            ...rawChangelog,
            entries: GenerateCommand._groupAndSortEntryListByType(trimmedEntryList),
        } as IChangelog; // casting here because we receive `Partial<IChangelog>` as a param
    }
}
