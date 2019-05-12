import CliCommandModel from '../../types/cli-arg.model';

export const INIT_CLI_COMMAND_MAP: {[key: string]: CliCommandModel} = {
    projectName: new CliCommandModel({
        arg: 'projectName',
        alias: 'p',
    }),
};
