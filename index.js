const minimist = require('minimist');
const hasArg = require('./lib/hasArg');
const hasArgCommand = require('./lib/hasArgCommand');
const cliHelp = require('./lib/cliHelp');
const compileCommand = require('./lib/command/compile');
const entryCommand = require('./lib/command/entry');
const CommandEnum = require('./lib/types/command.enum');

(function() {
    const args = minimist(process.argv.slice(2));

    if (hasArg(args, 'h')) {
        cliHelp(args);

        process.exit();
    }

    // loadOptions
    // !hasOptions -> generateDefaultOptionsFile

    if (hasArgCommand(args, CommandEnum.meta.map.entry) || hasArg(args, 'e')) {
        entryCommand(args);

        return;
    } else if (hasArgCommand(args, CommandEnum.meta.map.compile) || hasArg(args, 'c')) {
        compileCommand(args);

        return;
    }
})();
