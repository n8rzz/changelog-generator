import fs from 'fs';
import groupBy from 'lodash.groupby';
import minimist from 'minimist';
import path from 'path';
import sortBy from 'lodash.sortby';
import ConfigModel from '../../types/config.model';
import EntryModel, { IEntryModel } from '../entry/entry.model';
import { readFileAsync } from '../../read-file-async';

export interface IEntryGroup {
    [key: string]: EntryModel[]
}

export default class GenerateCommand {
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
        const sortedEntryList: IEntryGroup = GenerateCommand._groupAndSortEntryListByType(entryList);

        console.log('\n---: sortedEntryList ', sortedEntryList);
        // - prompt
        // - - select issue numbers included in release
        // - - user version number
        // # group entries by `type`, orderBy date
        // # convert json -> md
        // # read existing CHANGELOG
        // # append existing changelog to release
        // # write CHANGELOG
        // # SUCCESS feedback

        return Promise.resolve();
    }

    private static _groupAndSortEntryListByType(entryList: EntryModel[]): IEntryGroup {
        const groupedEntrylist: IEntryGroup = groupBy(entryList, 'type');

        return Object.keys(groupedEntrylist).reduce((sum: any, groupKey: string): any => {
            sum[groupKey] = sortBy(groupedEntrylist[groupKey], ['date']);

            return sum;
        }, {} as IEntryGroup)
    }
}
