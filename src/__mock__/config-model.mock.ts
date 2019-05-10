import { IConfigModel } from '../types/config.model';

export const validConfigModelMock: IConfigModel = {
    autoLinkIssue: true,
    defaultConfigFilename: '.changelog.json',
    entriesDir: './changelog',
    entryType: ['bugfix', 'feature'],
    lastTag: 'v1.0.0',
    issueSourceUrl: 'http://github.com/threeve',
    outputFilename: 'CHANGELOG',
    projectName: 'my app',
};
