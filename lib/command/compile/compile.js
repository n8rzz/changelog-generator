const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const fromJSON = require('tcomb/lib/fromJSON');
const readFileAsync = require('../../read-file-async');
const EntryModel = require('../../types/entry.model');

/**
 *
 *
 * @function buildEntryList
 * @param {ConfigModel} configModel
 * @returns {Promise<>}
 */
async function buildEntryList(configModel) {
    const entriesDir = path.join(process.cwd(), configModel.entriesDir);
    const fileNames = fs.readdirSync(entriesDir);

    return fileNames.reduce(async (previousPromise, fileName) => {
        const sum = await previousPromise;
        const rawEntry = await readFileAsync(path.join(entriesDir, fileName));
        const fielNameWithoutExtension = fileName.split('.json')[0];

        // `rawEntry` is going to be a Buffer, using `JSON.parse()` to
        // translate to an object that `tcomb` can evaluate
        sum[fielNameWithoutExtension] = fromJSON(JSON.parse(rawEntry), EntryModel);

        return sum;
    }, Promise.resolve({}));
}

/**
 *
 *
 * @public
 * @function compileCommand
 * @param {object|minimist.ParsedArgs} args
 * @param {ConfigModel} configModel
 */
async function compileCommand(args, configModel) {
    console.log('args', args);
    console.log('\nconfig', configModel);
    console.log('\n====================================================\n');

    console.log(chalk.grey('Before we can generate a changelog, we need a few bits of information...\n'));

    console.log(chalk.blue('** LOADING SPINNER **\n'));
    const entryList = await buildEntryList(configModel);

    console.log('$ entryList', Object.keys(entryList).length);
    // const entryProps = EntryModel.update(initialProps, {
    //     $merge: {
    //         ...extractEntryValuesFromCliArgs(args),
    //     },
    // });

    // - prompt
    // - - select issue numbers included in release
    // - - user version number
    // # group entries by `type`, orderBy date
    // # convert json -> md
    // # read existing CHANGELOG
    // # append existing changelog to release
    // # write CHANGELOG
    // # SUCCESS feedback
}

module.exports = compileCommand;
