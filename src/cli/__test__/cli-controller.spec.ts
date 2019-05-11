import test from 'ava';
import sinon from 'sinon';
import minimist from 'minimist';
import CliController from '../cli.controller';
import EntryCommand from '../../command/entry/entry-command';
import HelpCommand from '../../command/help/help-command';
import { configModelFixture } from '../../__fixture__/config-model.fixture';

test('CliController.execute() calls EntryCommand.execute() when entry command is passed as an arg', (t) => {
    const argsMock: minimist.ParsedArgs = {
        _: ['entry'],
    };
    const executeStub: sinon.SinonSpy = sinon.spy(EntryCommand, 'execute');

    CliController.execute(
        argsMock,
        configModelFixture,
    );

    t.is(executeStub.calledWithExactly(argsMock, configModelFixture), true);

    executeStub.restore();
});

test('CliController.execute() calls HelpCommand.execute() when entry command is passed as an arg', (t) => {
    const argsMock: minimist.ParsedArgs = {
        _: ['help'],
    };
    const executeStub: sinon.SinonSpy = sinon.spy(HelpCommand, 'execute');

    CliController.execute(
        argsMock,
        configModelFixture,
    );

    t.is(executeStub.calledWithExactly(argsMock, configModelFixture), true);

    executeStub.restore();
});
