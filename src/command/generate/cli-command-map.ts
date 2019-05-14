import CliCommandModel from '../../types/cli-arg.model';

export const GENERATE_CLI_COMMAND_MAP: {[key: string]: CliCommandModel} = {
    version: new CliCommandModel({
        arg: 'version',
    }),
};
