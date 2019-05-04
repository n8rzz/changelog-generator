import test from 'ava';
import hasArgCommand from './hasArgCommand';
import minimistArgsMock from './__mock__/minimist-args.mock';

test('.hasArgCommand() returns false when args is undefined', (t) => {
    t.false(hasArgCommand(undefined, 'entry'));
});

test('.hasArgCommand() returns false when argCommandKey is not present', (t) => {
    t.false(hasArgCommand(minimistArgsMock.validEntryCommandWithHelpMock, 'compile'));
});

test('.hasArgCommand() returns true when argCommandKey is present', (t) => {
    t.true(hasArgCommand(minimistArgsMock.validEntryCommandWithHelpMock, 'entry'));
});
