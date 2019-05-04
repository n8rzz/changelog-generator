import test from 'ava';
import hasArg from './hasArg';
import minimistArgsMock from './__mock__/minimist-args.mock';

test('.hasArg() returns false when args is undefined', (t) => {
    t.false(hasArg(undefined, 'd'));
});

test('.hasArg() returns false when argKey is not present', (t) => {
    t.false(hasArg(minimistArgsMock.validEntryCommandWithHelpMock, 'd'));
});

test('.hasArg() returns true when argKey is present', (t) => {
    t.true(hasArg(minimistArgsMock.validEntryCommandWithHelpMock, 'h'));
});
