const ConfigModel = require('../types/config.model');

const defaultConfigProps = {
    autoLinkIssue: true,
    defaultConfigFilename: '.changelog.json',
    entriesDir: '.changelog',
    outputFilename: 'CHANGELOG',
    entryType: ['bugfix', 'documentation', 'hotfix', 'feature', 'none'],
    lastTag: '',
    issueSourceUrl: '',
    projectName: '',
};

module.exports = new ConfigModel(defaultConfigProps);
