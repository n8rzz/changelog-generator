import test from 'ava';
import { hasArgCommand } from '../hasArgCommand';
import { validEntryCommandWithHelpMock } from '../__mock__/minimist-args.mock';
import { CommandEnum } from '../types/command.enum';

test('.hasArgCommand() returns false when argCommandKey is not present', (t) => {
    t.is(hasArgCommand(validEntryCommandWithHelpMock, null as any), false);
});

test('.hasArgCommand() returns true when argCommandKey is present', (t) => {
    t.is(hasArgCommand(validEntryCommandWithHelpMock, CommandEnum.Entry), true);
});
