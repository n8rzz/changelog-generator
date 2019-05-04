const EntryModel = require('../types/config.model');

const completeEntryModelFixture = new EntryModel({
    author: 'Nate Geslin',
    email: 'teamtomkins23@gmail.com',
    date: 'Thu, 09 May 2019 00:32:01 GMT',
    description: 'a changelog entry description would go here',
    issue: 'scm-4321',
    type: 'bugfix',
    issueSourceUrl: 'https://github.com/n8rzz/changelog-generator',
    skipFilenameCheck: false,
});

module.exports = completeEntryModelFixture;
