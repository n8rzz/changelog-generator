const ConfigModel = require('../types/config.model');

const defaultConfigProps = {
    autoLinkIssue: true,
    defaultConfigFilename: '.changelog.json',
    entriesDir: './changelog',
    outputFilename: 'CHANGELOG',
    entryType: ['bugfix', 'hotfix', 'feature', 'documentation'],
    lastTag: '',
    remoteUrl: '',
    projectName: ''
};

module.exports = new ConfigModel(defaultConfigProps);
