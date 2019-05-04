const fs = require('fs');
const path = require('path');
const ConfigModel = require('../types/config.model');

/**
 * @private
 * @function _hasStoredConfigAtDefaultPath
 * @returns {booelan}
 */
function _hasStoredConfigAtDefaultPath() {
    return fs.existsSync('.changelog.json');
}

/**
 * Attempt to write current configuration settings to file
 *
 * This could be initial or updated configuration
 *
 * @function writeConfig
 * @param config {ConfigModel}
 * @returns {void}
 */
function writeConfig(config) {
    if (!ConfigModel.is(config)) {
        throw TypeError('Expected a `ConfigModel`, that\'s not we we have here: ', config);
    }

    fs.writeFileSync('.changelog.json', config.toJson());
}

/**
 * @function hasChangelogDir
 * @returns {boolean}
 */
function hasChangelogDir() {
    // TODO: use configuration for `dir`
    let hasEntriesDir = false;

    try {
        const stats = fs.statSync(path.join(process.cwd(), '.changelog'));

        if (!stats.isDirectory()) {
            // using `throw` here to move to the `catch`, this error is
            // ignored within the `catch`
            throw new Error('Did not find changelog entries directory');
        }

        hasEntriesDir = true;
    // eslint-disable-next-line no-empty
    } catch (e) {}

    return hasEntriesDir;
}

/**
 * @function hasStoredConfig
 * @returns {boolean}
 */
function hasStoredConfig() {
    return _hasStoredConfigAtDefaultPath();
}

/**
 * @function createChangelogEntriesDir
 * @returns {void}
 */
function createChangelogEntriesDir() {
    // TODO: use config value
    fs.mkdirSync(path.join(process.cwd(), '.changelog'));
}

/**
 * @function loadSavedConfig
 * @returns {object|null}
 */
function loadSavedConfig() {
    if (!_hasStoredConfigAtDefaultPath()) {
        return null;
    }

    const configDataFromFile = fs.readFileSync('.changelog.json', 'utf-8');

    return JSON.parse(configDataFromFile);
}

/**
 * Will attempt to load save configuration
 *
 * @async
 * @function load
 * @returns {Promise<ConfigModel>}
 */
async function load() {
    const configProps = loadSavedConfig();

    return Promise.resolve(new ConfigModel(configProps));
}

module.exports = {
    createChangelogEntriesDir,
    hasChangelogDir,
    hasStoredConfig,
    load,
    writeConfig,
};
