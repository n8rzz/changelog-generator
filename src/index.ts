import chalk from 'chalk';
import minimist from 'minimist';
import CliController from './cli/cli.controller';
import HelpCommand from './command/help/help-command';
import InitCommand from './command/init/init-command';
import {
    hasStoredConfig,
    load,
} from './config/config';
import { hasArg } from './hasArg';
import { hasArgCommand } from './hasArgCommand';
import { CommandEnum } from './types/command.enum';

/* eslint-disable */
(async function(): Promise<void> {
    const args: minimist.ParsedArgs = minimist(process.argv.slice(2));

    // we short circuit he process here so we can presetn help
    // to the user before having to load or eval any files
    if (hasArg(args, 'h')) {
        HelpCommand.execute(args);

        return;
    }

    if (!hasStoredConfig() && !hasArgCommand(args, CommandEnum.Init)) {
        console.log(chalk.yellow('No configuration file found. Before attempting to generate a new entry, please run: '));
        console.log(chalk.white('\n$ changelog-generator init\n'));

        return;
    }

    if (hasArgCommand(args, CommandEnum.Init)) {
        await InitCommand.execute(args);

        return;
    }

    const storedConfig = await load();

    console.log('\n================================================================================\n\n');

    CliController.execute(args, storedConfig);
})();
