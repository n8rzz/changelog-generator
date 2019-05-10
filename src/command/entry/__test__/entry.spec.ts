import test from 'ava';
import sinon from 'sinon';
import minimist from 'minimist';
import EntryModel from '../../../types/entry.model';
import EntryCommand from '../entry';
import { validEntryCommandWithArgsMock } from '../../../__mock__/minimist-args.mock';
import { entryModelFixture } from '../../../__fixture__/entry-model.fixture';
import { configModelFixture } from '../../../__fixture__/config-model.fixture';

const cliArgMock: minimist.ParsedArgs = {
    _: ['entry'],
    i: 'scm-4321',
    d: 'a changelog entry description would go here',
};

test('.entryCommand()', (t) => {
    t.notThrows(() => {
        return EntryCommand.execute(validEntryCommandWithArgsMock as minimist.ParsedArgs, configModelFixture);
    });
});

test('.extractEntryValuesFromCliArgs()', (t) => {
    const expectedResult = {
        description: 'a changelog entry description would go here',
        issue: 'scm-4321',
    };
    const result: Partial<EntryModel> = EntryCommand.extractEntryValuesFromCliArgs(cliArgMock);

    t.deepEqual(result, expectedResult);
});

test('.renderSkipFilenameCheckMessage()', (t) => {
    const consoleLogSpy: sinon.SinonSpy = sinon.spy(global.console, 'log');
    const expectedResult: string = '\u001b[33m\u001b[39m\n\u001b[33m* Verify the information for this entry is correct and try again with the \u001b[37m-f\u001b[33m option.\u001b[39m';

    EntryCommand.renderSkipFilenameCheckMessage(entryModelFixture);

    t.is(consoleLogSpy.getCall(0).args[0], expectedResult);

    consoleLogSpy.restore();
});
