import test from 'ava';
import CliArgModel from './cli-arg.model';
import cliArgModelMock from '../__mock__/cli-arg-model.mock';
import minimistArgsMock from '../__mock__/minimist-args.mock';

test('CliArgModel does not throw when passed valid data', (t) => {
    t.notThrows(() => new CliArgModel(cliArgModelMock.validArgWithoutAliasMock));
    t.notThrows(() => new CliArgModel(cliArgModelMock.validCliArgMock));
});

test('.extractArgValueByCommandOrAlias() returns null when arg or alias is not present', (t) => {
    const model = new CliArgModel(cliArgModelMock.validCliArgMock);
    const result = model.extractArgValueByCommandOrAlias(minimistArgsMock.validEntryCommandWithoutArgsMock);

    t.true(result === null);
});

test('.extractArgValueByCommandOrAlias() returns value by command argument', (t) => {
    const argsMock = {
        ...minimistArgsMock.validEntryCommandWithoutArgsMock,
        issue: 'asf-5543',
    };
    const model = new CliArgModel(cliArgModelMock.validCliArgMock);
    const result = model.extractArgValueByCommandOrAlias(argsMock);

    t.true(result === argsMock.issue);
});

test('.extractArgValueByCommandOrAlias() returns value by command alias', (t) => {
    const argsMock = {
        ...minimistArgsMock.validEntryCommandWithoutArgsMock,
        i: 'asf-5543',
    };
    const model = new CliArgModel(cliArgModelMock.validCliArgMock);
    const result = model.extractArgValueByCommandOrAlias(argsMock);

    t.true(result === argsMock.i);
});
