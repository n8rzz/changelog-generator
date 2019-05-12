import minimist from 'minimist';
import ConfigModel from '../types/config.model';
import { CommandContructorMap } from './command-constructor-map';
import { hasArgCommand } from '../hasArgCommand';
import { hasArg } from '../hasArg';
import { CommandEnum } from '../types/command.enum';

export default class CliController {
    public static execute(args: minimist.ParsedArgs, storedConfig: ConfigModel): void {
        const command: CommandEnum = CliController._findCommandByNameOrAlias(args);

        CommandContructorMap[command].execute(args, storedConfig);
    }

    private static _findCommandByNameOrAlias(args: minimist.ParsedArgs): CommandEnum {
        if (hasArgCommand(args, CommandEnum.Compile) || hasArg(args, 'c')) {
            return CommandEnum.Compile;
        } else if (hasArgCommand(args, CommandEnum.Entry) || hasArg(args, 'e')) {
            return CommandEnum.Entry;
        } else if (hasArgCommand(args, CommandEnum.Init)) {
            return CommandEnum.Init;
        }

        return CommandEnum.Help;
    }
}
