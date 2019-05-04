const minimalEntryModelMock = {
    date: new Date().toUTCString(),
    skipFilenameCheck: false,
};

const completeEntryModelMock = {
    ...minimalEntryModelMock,

    author: 'Steve Perry',
    email: 'steve.perry@aerosmith.com',
    description: 'These are the words that make up a Changelog Entry description',
    issue: '7766',
    type: 'feature',
    issueSourceUrl: 'http://github.com/n8rzz/gbrdm',
};

module.exports = {
    minimalEntryModelMock,
    completeEntryModelMock,
};
