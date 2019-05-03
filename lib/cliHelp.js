const chalk = require('chalk');
const hasArgCommand = require('./hasArgCommand');
const CommandEnum = require('./types/command.enum');

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
        -h              help
        --author        author of work
        --authorEmail   author email address
        --branchName    name of git branch work was done on
        --date          date of changelog entry, will default to now if not provided
        --description   description of changes
        --issueNumber   issue number that requested these changes
        --issueUrl      url to issue
        --type          change type, defaults to one of [bugfix, hotfix, feature, documentation]
                        this can be changed via \`.changelog.json\` file
`;

const compileUsage = `
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

function cliHelp(args) {
    console.log('.cliHelp() ', args);

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

// Create changelog entry

// - _date
// - _branchName
// - author
// - ?author email
// - issue Number
// - ?issue link
// - change description
// - change type: [bugfix, hotfix, feature, documentation]


// Compile Changelog for release

// - version
// - ?preview


// init config

// - authorName: `${git config user.name}`
// - authorEmail: `${git config user.email}`
// - project name
// - origin remote url
// - lastTag: `${git describe --tags `git rev-list --tags --max-count=1`}`

// config

// autoLinkIssue: true
// changelogDir: `./changelog'
// compiledFilename: `CHANGELOG'
// entryType: [bugfix, hotfix, feature, documentation]
