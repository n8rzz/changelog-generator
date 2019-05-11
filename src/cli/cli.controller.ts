import minimist from 'minimist';
import { cliHelp } from './help';
import { initChangelogDir } from './initChangelogDir';
import { initConfig } from './initConfig';

export default class CliController {
    public static help(args: minimist.ParsedArgs): void {
        cliHelp(args);
    }

    public static initializeChangelogDirectory(): void {
        initChangelogDir();
    }

    public static async initializeConfigFile(): Promise<void> {
        await initConfig();
    }
}
