import { IConfig } from '../types/i-config';

export const validConfigModelMock: IConfig = {
    autoLinkIssue: true,
    defaultConfigFilename: '.changelog.json',
    entriesDir: './changelog',
    entryType: ['bugfix', 'feature'],
    lastTag: 'v1.0.0',
    issueSourceUrl: 'http://github.com/threeve',
    outputFilename: 'CHANGELOG',
    projectName: 'my app',
};
