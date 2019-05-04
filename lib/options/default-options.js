const OptionsModel = require('../types/options.model');

const defaultOptionProps = {
    autoLinkIssue: true,
    defaultConfigFilename: '.changelog.json',
    entriesDir: './changelog',
    outputFilename: 'CHANGELOG',
    entryType: ['bugfix', 'hotfix', 'feature', 'documentation'],
    lastTag: '',
    remoteUrl: '',
    projectName: ''
};

module.exports = new OptionsModel(defaultOptionProps);
