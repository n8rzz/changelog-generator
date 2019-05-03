const t = require('tcomb');

// Create changelog entry
/**
 *
 * _date
 * _branchName
 * author
 * ?author email
 * issue Number
 * ?issue url
 * change description
 * change type: [bugfix, hotfix, feature, documentation]
 */
export const EntryModel = t.struct({
    author: t.String,
    authorEmail: t.maybe(t.String),
    branchName: t.String,
    date: t.Date,
    description: t.String,
    issueNumber: t.maybe(t.String),
    issueUrl: t.maybe(t.String),
    type: t.String
}, 'EntryModel');
