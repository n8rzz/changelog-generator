import chalk from 'chalk';
import minimist from 'minimist';
import { hasArgCommand } from '../../hasArgCommand';
import { CommandEnum } from '../../types/command.enum';

const basicUsage: string = `
    Usage:
        ${chalk.white('$ changelog-generator <command> <options>')}

    Example:
        $ changelog-generator init
        $ changelog-generator entry -i bug-234 -d "This is an entry description"

    Commands:
        compile     compile entires into new a changelog for release
        entry       create a changelog entry for current release
        init        create configuration file and entries directory

        Each command provides support for the help option:
            $ changelog-generator <command> -h

    Options:
        -h          help
`;

const compileUsage: string = `
    Usage:
        ${chalk.white('$ changelog-generator compile <options>')}

    Example:
        $ changelog-generator compile

    Options:
        -h              help
        --version       next release version
        --filename      name of resulting file, defaults to \`CHANGELOG\`
        --append        if filename exists, will attempt to append to existing file
`;
const entryUsage: string = `
    Usage:
        ${chalk.white('$ changelog-generator entry <options>')}

    Example:
        $ changelog-generator entry
        $ changelog-generator entry -d "this is an entry description"

    Options:
        -a, --author                author of work, will default to \`git\` user name
        -d, --description           description of changes, should be encolsed with double quotes
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

        Will produce a json file in the \`.changelog\` (default) directory, or whatever you have
        defined as the \`entiresDir\` from the configuration file
        `;
const initUsage: string = `
    Usage:
        ${chalk.white('$ changelog-generator init <options>')}

    Example:
        $ changelog-generator init

    Options:
        -e, --entriesDir            name of the directory changelog entry files will be stored,
                                    defaults to \`.changelog\`
        -p, --projectName           name of your project

    Description:
        -- TODO --
        `;

export default class HelpCommand {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static execute(args: minimist.ParsedArgs): void {
        if (hasArgCommand(args, CommandEnum.Compile)) {
            console.log(`${chalk.grey(compileUsage)}`);

            return;
        }

        if (hasArgCommand(args, CommandEnum.Entry)) {
            console.log(`${chalk.grey(entryUsage)}`);

            return;
        }

        if (hasArgCommand(args, CommandEnum.Init)) {
            console.log(`${chalk.grey(initUsage)}`);

            return;
        }

        console.log(`${chalk.grey(basicUsage)}`);
    }
}
