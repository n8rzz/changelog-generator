import minimist from 'minimist';
import { cliHelp } from './cli/help';
import { initChangelogDir } from './cli/initChangelogDir';
import { initConfig } from './cli/initConfig';
import {
    hasStoredConfig,
    load,
} from './config/config';
import EntryCommand from './command/entry/entry';
import { hasArg } from './hasArg';
import { hasArgCommand } from './hasArgCommand';
import { CommandEnum } from './types/command.enum';

/* eslint-disable */
(async function(): Promise<void> {
    const args: minimist.ParsedArgs = minimist(process.argv.slice(2));


    if (hasArg(args, 'h')) {
        cliHelp(args);

        return;
    }

    if (!hasStoredConfig()) {
        await initConfig();
        initChangelogDir();
    }

    const storedConfig = await load();

    console.log('\n================================================================================\n\n');

    if (hasArgCommand(args, CommandEnum.Entry) || hasArg(args, 'e')) {
        EntryCommand.execute(args, storedConfig);

        return;
    } else if (hasArgCommand(args, CommandEnum.Compile) || hasArg(args, 'c')) {
        // command.compile(args, storedConfig);

        return;
    }
})();
