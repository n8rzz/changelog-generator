import minimist from 'minimist';
import CliController from './cli/cli.controller';
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
        CliController.help(args);

        return;
    }

    if (!hasStoredConfig()) {
        await CliController.initializeConfigFile();
        CliController.initializeChangelogDirectory();
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
