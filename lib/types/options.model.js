const t = require('tcomb');

const OptionsModel = t.struct({
    autoLinkIssue: t.Boolean,
    defaultConfigFilename: t.String,
    entriesDir: t.String,
    entryType: t.list(t.String),
    lastTag: t.String,
    remoteUrl: t.maybe(t.String),
    outputFilename: t.String,
    projectName: t.String,
}, 'OptionsModel');

module.exports = OptionsModel;
