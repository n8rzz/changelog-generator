import ConfigModel from '../types/config.model';
import { IConfig } from '../types/i-config';

const defaultConfigProps: IConfig = {
    autoLinkIssue: true,
    defaultConfigFilename: '.changelog.json',
    entriesDir: '.changelog',
    entryType: ['bugfix', 'documentation', 'hotfix', 'feature', 'none'],
    issueSourceUrl: '',
    lastTag: '',
    outputFilename: 'CHANGELOG',
    projectName: '',
};

export const defaultConfig = new ConfigModel(defaultConfigProps);
