const OptionsModel = require('../types/options.model');

const defaultOptions = new OptionsModel({
    email: '',
    name: '',
    autoLinkIssue: true,
    entriesDir: './changelog',
    outputFilename: 'CHANGELOG',
    entryType: ['bugfix', 'hotfix', 'feature', 'documentation'],
    lastTag: '',
    remoteUrl: '',
    projectName: ''
});

module.exports = Object.assign({}, defaultOptions);
