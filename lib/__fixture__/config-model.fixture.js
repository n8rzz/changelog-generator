const ConfigModel = require('../types/config.model');

module.exports = new ConfigModel({
    autoLinkIssue: true,
    defaultConfigFilename: '.changelog.json',
    entriesDir: '.changelog',
    entryType: [
        'bugfix',
        'documentation',
        'hotfix',
        'feature',
        'none',
    ],
    lastTag: '1.33.2',
    issueSourceUrl: 'https://github.com/n8rzz/changelog-generator',
    outputFilename: 'CHANGELOG',
    projectName: 'fair-verona',
});
