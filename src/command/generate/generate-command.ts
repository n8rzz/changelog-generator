import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import ConfigModel from '../../types/config.model';
// import EntryModel, { IEntryModel } from '../entry/entry.model';
// import { readFileAsync } from '../../read-file-async';

export default class GenerateCommand {
    public static async execute(args: minimist.ParsedArgs, config: ConfigModel): Promise<void> {
        console.log('\n\nargs', args);
        console.log('\n\nconfig', config);
        console.log('\n\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n\n');

        // assembleEntries
        const entries: any[] = await GenerateCommand.buildEntryList(config);
        console.log('---: ', entries);
        // sortEntriesByType
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

    private static async buildEntryList(configModel: ConfigModel): Promise<any[]> {
        const entriesDir = path.join(process.cwd(), configModel.entriesDir);
        const fileNames = fs.readdirSync(entriesDir);
        // const entryList: Promise<EntryModel>[] = await fileNames.map(async (fileName): Promise<EntryModel> => {
        //     // const fielNameWithoutExtension = fileName.split('.json')[0];
        //     const rawEntry: string = await readFileAsync(path.join(entriesDir, fileName));
        //     // `rawEntry` is going to be a Buffer, using `JSON.parse()` to
        //     // translate to an object that `tcomb` can evaluate
        //     const entryModelProps: IEntryModel = JSON.parse(rawEntry);
        //     const entryModel: EntryModel = new EntryModel(entryModelProps);

        //     return entryModel;
        // });
        console.log('---: ', fileNames);
        // return entryList;
        return Promise.resolve([]);
    }
}
