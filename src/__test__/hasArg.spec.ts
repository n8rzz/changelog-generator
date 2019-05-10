import test from 'ava';
import { hasArg } from '../hasArg';
import { validEntryCommandWithHelpMock } from '../__mock__/minimist-args.mock';

test('.hasArg() returns false when argKey is not present', (t) => {
    t.false(hasArg(validEntryCommandWithHelpMock, 'd'));
});

test('.hasArg() returns true when argKey is present', (t) => {
    t.true(hasArg(validEntryCommandWithHelpMock, 'h'));
});
