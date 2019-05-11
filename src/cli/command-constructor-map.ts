import EntryCommand from '../command/entry/entry-command';
import HelpCommand from '../command/help/help-command';
import { CommandEnum } from '../types/command.enum';

export const CommandContructorMap: {[key in CommandEnum]: any} = {
    [CommandEnum.Init]: () => { console.log('command ', CommandEnum.Init); },
    [CommandEnum.Entry]: EntryCommand,
    [CommandEnum.Compile]: () => { console.log('command ', CommandEnum.Compile); },
    [CommandEnum.Generate]: () => { console.log('command ', CommandEnum.Generate); },
    [CommandEnum.Help]: HelpCommand,
};
