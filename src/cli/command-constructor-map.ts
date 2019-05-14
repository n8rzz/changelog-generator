import EntryCommand from '../command/entry/entry-command';
import GenerateCommand from '../command/generate/generate-command';
import HelpCommand from '../command/help/help-command';
import InitCommand from '../command/init/init-command';
import { CommandEnum } from '../types/command.enum';

export const CommandContructorMap: {[key in CommandEnum]: any} = {
    [CommandEnum.Init]: InitCommand,
    [CommandEnum.Entry]: EntryCommand,
    [CommandEnum.Generate]: GenerateCommand,
    [CommandEnum.Help]: HelpCommand,
};
