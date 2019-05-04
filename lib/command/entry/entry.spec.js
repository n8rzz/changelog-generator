import test from 'ava';
import sinon from 'sinon';
import * as entry from './entry';
import configMock from '../../__mock__/config-model.mock';
import entryModelMock from '../../__mock__/entry-model.mock';
import minimistArgsMock from '../../__mock__/minimist-args.mock';

test('.entryCommand()', (t) => {
    t.notThrows(
        () => entry.entryCommand(minimistArgsMock.validEntryCommandWithArgsMock, configMock.validConfigModelMock),
    );
});

test('.renderSkipFilenameCheckMessage()', (t) => {
    const consoleLogSpy = sinon.spy(global.console, 'log');
    const expectedResult = '\u001b[33m\u001b[39m\n\u001b[33m* Verify the information for this entry is correct and try again with the \u001b[37m-f\u001b[33m option.\u001b[39m';

    entry.renderSkipFilenameCheckMessage(entryModelMock.completeEntryModelMock);

    t.is(consoleLogSpy.getCall(0).args[0], expectedResult);

    consoleLogSpy.restore();
});
