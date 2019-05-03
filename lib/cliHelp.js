const chalk = require('chalk');

const helpTitle = `
    changelog-generator
`;
const optionsDescription = `
    Usage:
        ${chalk.white('$ changelog-generator <commands> <options>')}

    Example:
        ${chalk.white('$ changelog-generator entry')}
        ${chalk.white('$ changelog-generator compile')}

    Commands:
        entry       create a changelog entry for current release
        compile     compile entires into new a changelog for release

    Options:
        -h          help
`;

function cliHelp() {
    console.log(`${chalk.green(helpTitle)}\n${chalk.grey(optionsDescription)}`);
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
