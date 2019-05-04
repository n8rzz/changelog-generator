const OptionsModel = require('../types/options.model');

const defaultOptions = new OptionsModel({
    autoLinkIssue: true,
    defaultConfigFilename: '.changelog.json',
    entriesDir: './changelog',
    outputFilename: 'CHANGELOG',
    entryType: ['bugfix', 'hotfix', 'feature', 'documentation'],
    lastTag: '',
    remoteUrl: '',
    projectName: ''
});

module.exports = Object.assign({}, defaultOptions);
