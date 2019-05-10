import { IEntryModel } from '../types/entry.model';

export const minimalEntryModelMock: IEntryModel = {
    author: 'Steve Perry',
    date: new Date().toUTCString(),
    email: 'steve.perry@aerosmith.com',
    issueSourceUrl: 'http://github.com/n8rzz/gbrdm',
    skipFilenameCheck: false,
};

export const completeEntryModelMock: IEntryModel = {
    ...minimalEntryModelMock,

    description: 'These are the words that make up a Changelog Entry description',
    issue: '7766',
    type: 'feature',
};
