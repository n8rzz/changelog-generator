const minimist = require('minimist');
const cli = require('./lib/cli/cli');
const config = require('./lib/config/config');
const hasArg = require('./lib/hasArg');
const hasArgCommand = require('./lib/hasArgCommand');
const command = require('./lib/command');
const CommandEnum = require('./lib/types/command.enum');

/* eslint-disable */
(async function() {
    const args = minimist(process.argv.slice(2));

    if (hasArg(args, 'h')) {
        cli.help(args);

        return;
    }

    if (!config.hasStoredConfig()) {
        await cli.initConfig();
        cli.initChangelogDir();
    }

    const storedConfig = await config.load();

    console.log('\n================================================================================\n\n');

    if (hasArgCommand(args, CommandEnum.meta.map.entry) || hasArg(args, 'e')) {
        command.entry(args, storedConfig);

        return;
    } else if (hasArgCommand(args, CommandEnum.meta.map.compile) || hasArg(args, 'c')) {
        command.compile(args, storedConfig);

        return;
    }
})();
