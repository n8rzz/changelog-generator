import minimist from 'minimist';
import CliController from './cli/cli.controller';
import HelpCommand from './command/help/help-command';
import {
    hasStoredConfig,
    load,
} from './config/config';
import { hasArg } from './hasArg';

/* eslint-disable */
(async function(): Promise<void> {
    const args: minimist.ParsedArgs = minimist(process.argv.slice(2));

    // we short circuit he process here so we can presetn help
    // to the user before having to load or eval any files
    if (hasArg(args, 'h')) {
        HelpCommand.execute(args);

        return;
    }

    if (!hasStoredConfig()) {
        await CliController.initializeConfigFile();
        CliController.initializeChangelogDirectory();
    }

    const storedConfig = await load();

    console.log('\n================================================================================\n\n');

    CliController.execute(args, storedConfig);
})();
