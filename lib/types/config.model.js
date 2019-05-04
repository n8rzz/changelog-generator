const t = require('tcomb');

/**
 * Defines the shape of what we look for in the
 * configuration file.
 *
 * @type ConfigModel
 */
const ConfigModel = t.struct({
    autoLinkIssue: t.Boolean,
    defaultConfigFilename: t.String,
    entriesDir: t.String,
    entryType: t.list(t.String),
    lastTag: t.String,
    issueSourceUrl: t.maybe(t.String),
    outputFilename: t.String,
    projectName: t.String,
}, 'ConfigModel');

/**
 * Return the instance as a string, with pretty
 * formatting, in preparation for writing to file
 *
 * @method toJson
 * @returns {string}
 */
ConfigModel.prototype.toJson = function toJson() {
    return JSON.stringify(this, null, 2);
};

module.exports = ConfigModel;
