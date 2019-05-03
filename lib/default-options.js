const defaultOptions = {
    authorEmail: '${git config user.email}',
    authorName: '${git config user.name}',
    autoLinkIssue: true,
    changelogDir: './changelog',
    compiledFilename: 'CHANGELOG',
    entryType: ['bugfix', 'hotfix', 'feature', 'documentation'],
    lastTag: '${git describe --tags `git rev-list --tags --max-count=1`}',
    originUrl: '',
    projectName: ''
};

module.exports = Object.assign({}, defaultOptions);
