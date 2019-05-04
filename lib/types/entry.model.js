const t = require('tcomb');

/**
 * @type EntryModel
 */
const EntryModel = t.struct({
    author: t.maybe(t.String),
    email: t.maybe(t.String),
    date: t.String,
    description: t.maybe(t.String),
    issue: t.maybe(t.String),
    type: t.maybe(t.String),
    issueSourceUrl: t.maybe(t.String),
    skipFilenameCheck: t.Boolean,
}, 'EntryModel');

EntryModel.prototype.authorNameWithoutSpaces = function authorNameWithoutSpaces() {
    if (!this.author) {
        return '';
    }

    return this.author.split(' ').join('-');
};

EntryModel.prototype.generateFileName = function generateFileName() {
    const nowInSeconds = new Date(this.date).getTime();

    if (!this.issue || !this.author) {
        return `${nowInSeconds}.json`;
    }

    return `${nowInSeconds}-${this.issue.toLowerCase()}-${this.authorNameWithoutSpaces().toLowerCase()}.json`;
};

module.exports = EntryModel;
