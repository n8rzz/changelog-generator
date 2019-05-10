import test from 'ava';
import CliArgModel from '../cli-arg.model';
import {
    validArgWithoutAliasMock,
    validCliArgMock,
} from '../../__mock__/cli-arg-model.mock';
import {
    validEntryCommandWithoutArgsMock,
} from '../../__mock__/minimist-args.mock';

test('CliArgModel does not throw when passed valid data', (t) => {
    // eslint-disable-next-line arrow-body-style
    t.notThrows(() => new CliArgModel({ ...validArgWithoutAliasMock }));
    // eslint-disable-next-line arrow-body-style
    t.notThrows(() => new CliArgModel({ ...validCliArgMock }));
});

test('.extractArgValueByCommandOrAlias() returns null when arg or alias is not present', (t) => {
    const model = new CliArgModel({ ...validCliArgMock });
    const result = model.extractArgValueByCommandOrAlias(validEntryCommandWithoutArgsMock);

    t.true(result === null);
});

test('.extractArgValueByCommandOrAlias() returns value by command argument', (t) => {
    const argsMock = {
        ...validEntryCommandWithoutArgsMock,
        issue: 'asf-5543',
    };
    const model = new CliArgModel({ ...validCliArgMock });
    const result = model.extractArgValueByCommandOrAlias(argsMock);

    t.true(result === argsMock.issue);
});

test('.extractArgValueByCommandOrAlias() returns value by command alias', (t) => {
    const argsMock = {
        ...validEntryCommandWithoutArgsMock,
        i: 'asf-5543',
    };
    const model = new CliArgModel({ ...validCliArgMock });
    const result = model.extractArgValueByCommandOrAlias(argsMock);

    t.true(result === argsMock.i);
});
