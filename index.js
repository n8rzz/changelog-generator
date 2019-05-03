const minimist = require('minimist');
const hasArg = require('./lib/hasArg');
const hasArgCommand = require('./lib/hasArgCommand');
const cli = require('./lib/cli/cli');
const options = require('./lib/options/options');
const command = require('./lib/command/command');
const CommandEnum = require('./lib/types/command.enum');

(async function() {
    const args = minimist(process.argv.slice(2));

    if (hasArg(args, 'h')) {
        cli.help(args);

        return;
    }

    if (!options.hasStoredConfig()) {
        await cli.initConfig();
    }

    const config = await options.load();

    if (hasArgCommand(args, CommandEnum.meta.map.entry) || hasArg(args, 'e')) {
        command.entry(args, config);

        return;
    } else if (hasArgCommand(args, CommandEnum.meta.map.compile) || hasArg(args, 'c')) {
        command.compile(args, config);

        return;
    }
})();
