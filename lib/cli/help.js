const chalk = require('chalk');
const hasArgCommand = require('../hasArgCommand');
const CommandEnum = require('../types/command.enum');

const basicUsage = `
    Usage:
        ${chalk.white('$ changelog-generator <command> <options>')}

    Example:
        $ changelog-generator entry
        $ changelog-generator compile

    Commands:
        entry       create a changelog entry for current release
        compile     compile entires into new a changelog for release

        Each command provides support for the help option:
            $ changelog-generator entry -h
            $ changelog-generator compile -h

    Options:
        -h          help
`;

const entryUsage = `
    Usage:
        ${chalk.white('$ changelog-generator entry <options>')}

    Example:
        $ changelog-generator entry

    Options:
        -a, --author                author of work, will default to \`git\` user name
        -d, --description           description of changes
        -e, --email                 author email address, will default to \`git\` user email
        -i, --issue                 issue number that requested these changes

        -t, --type                  change type, one of [bugfix, hotfix, feature, documentation]
                                    this can be changed via \`.changelog.json\` file
        -f, --skipFilenameCheck     will skip checking for existing entries that may have a similar
                                    or identical file name. Passing this flag could result in
                                    overwriting an existing entry file.
        --date                      date of changelog entry, will default to now if not provided

    Description:
        Initiates creation of a new changelog entry via \`inquirer\` prompts. If a value is passed
        for any option below, that value will be used in the prompts and will be editable.

        Will produce a json file in the '.changelog' directory.
        `;

const compileUsage = `
    Usage:
        ${chalk.white('$ changelog-generator compile <options>')}

    Example:
        $ changelog-generator compile --version 4.2.3 -d

    Options:
        -h              help
        -d              will output changelog to terminal without writing the file
        --version       next release version
        --filename      name of resulting file, defaults to \`CHANGELOG\`
`;

/**
 * Display the appropriate help documentation
 *
 * We should be here as a result of a `-h` argument
 *
 * TODO: move command-specific help to command dirs
 * instead of doing it inline here, it could be something
 * like: `command.entry.help()`, etc
 *
 * @function cliHelp
 * @param args {object}
 * @returns {void}
 */
function cliHelp(args) {
    if (hasArgCommand(args, CommandEnum.meta.map.entry)) {
        console.log(`${chalk.grey(entryUsage)}`);

        return;
    }

    if (hasArgCommand(args, CommandEnum.meta.map.compile)) {
        console.log(`${chalk.grey(compileUsage)}`);

        return;
    }

    console.log(`${chalk.grey(basicUsage)}`);
}

module.exports = cliHelp;
