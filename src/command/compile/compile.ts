import minimist from 'minimist';
import ConfigModel from '../../types/config.model';

export default class CompileCommand {
    public static async execute(args: minimist.ParsedArgs, options: ConfigModel): Promise<void> {
        console.log('.compileCommand()\n', args, '\n', options);

        return Promise.resolve();
    }
}
