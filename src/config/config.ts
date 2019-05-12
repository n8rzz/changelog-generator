import fs from 'fs';
import path from 'path';
import ConfigModel from '../types/config.model';
import { defaultConfig } from './default-config';
import { IConfig } from '../types/i-config';

/**
 *
 * FIXME: this should be moved to a singleton or some other class
 *
 */

/**
 * @private
 * @function _hasStoredConfigAtDefaultPath
 * @returns {booelan}
 */
export function _hasStoredConfigAtDefaultPath(): boolean {
    return fs.existsSync(defaultConfig.defaultConfigFilename);
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
export function writeConfig(config: ConfigModel): void {
    fs.writeFileSync(config.defaultConfigFilename, config.toJson());
}

/**
 * @function hasChangelogDir
 * @returns {boolean}
 */
export function hasChangelogDir(): boolean {
    let hasEntriesDir: boolean = false;

    try {
        const stats: fs.Stats = fs.statSync(path.join(process.cwd(), defaultConfig.entriesDir));

        if (!stats.isDirectory()) {
            // using `throw` here to force call to the `catch`,
            // this error is ignored within the `catch`
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
export function hasStoredConfig(): boolean {
    return _hasStoredConfigAtDefaultPath();
}

/**
 * @function loadSavedConfig
 * @returns {IConfig|undefined}
 */
export function loadSavedConfig(): ConfigModel|null {
    if (!_hasStoredConfigAtDefaultPath()) {
        return null;
    }

    const configDataFromFile: string = fs.readFileSync(defaultConfig.defaultConfigFilename, 'utf-8');
    const configProps: IConfig = JSON.parse(configDataFromFile);

    return new ConfigModel(configProps);
}

/**
 * Will attempt to load save configuration
 *
 * @async
 * @function load
 * @returns {Promise<ConfigModel>}
 */
export async function load(): Promise<ConfigModel> {
    const configProps: ConfigModel = loadSavedConfig() as ConfigModel;

    return Promise.resolve(configProps);
}
