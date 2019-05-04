
const fs = require('fs');

function _hasStoredConfigAtDefaultPath() {
    return fs.existsSync('.changelog.json');
}

function writeConfig(config) {
    fs.writeFileSync('.changelog.json', JSON.stringify(config, null, 2));
}

function loadSavedConfig() {
    if (!_hasStoredConfigAtDefaultPath()) {
        return null;
    }

    const configDataFromFile = fs.readFileSync('.changelog.json', 'utf-8');

    return JSON.parse(configDataFromFile);
}
function hasStoredConfig() {
    return _hasStoredConfigAtDefaultPath();
}

async function load() {
    const config = loadSavedConfig();

    return Promise.resolve(config);
}

module.exports = {
    hasStoredConfig,
    load,
    writeConfig,
}
