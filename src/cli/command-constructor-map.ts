import EntryCommand from '../command/entry/entry-command';
import HelpCommand from '../command/help/help-command';
import InitCommand from '../command/init/init-command';
import { CommandEnum } from '../types/command.enum';

export const CommandContructorMap: {[key in CommandEnum]: any} = {
    [CommandEnum.Init]: InitCommand,
    [CommandEnum.Entry]: EntryCommand,
    [CommandEnum.Compile]: () => { console.log('command ', CommandEnum.Compile); },
    [CommandEnum.Generate]: () => { console.log('command ', CommandEnum.Generate); },
    [CommandEnum.Help]: HelpCommand,
};
