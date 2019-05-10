import ConfigModel from '../types/config.model';

const defaultConfigProps = {
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
