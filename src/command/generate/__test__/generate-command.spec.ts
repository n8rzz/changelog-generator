import test from 'ava';
import sinon from 'sinon';
// import fs from 'fs';
import minimist from 'minimist';
import GenerateCommand from '../generate-command';
import { configModelFixture } from '../../../__fixture__/config-model.fixture';

// const fileNameListMock: string[] = [
//     '1557836292000-scm-4321-bob-barker.json',
//     '1557836303000-scm-5546-shooter-mcgavin.json',
//     '1557836316000-scm-7775-happy-gilmore.json'
// ]

// test('GenerateCommand.buildEntryList() returns a list of EntryModels', () => {
//     const readdirSyncStub: sinon.SinonStub = sinon.stub(fs, 'readdirSync').returns(fileNameListMock as any);
//     const result = GenerateCommand.buildEntryList(configModelFixture);

//     console.log('\n---: ', result);

//     readdirSyncStub.restore();
// });

test('GenerateCommand.execute() calls .buildEntryList()', (t) => {
    const argsMock: minimist.ParsedArgs = {
        _: ['generate'],
    };
    const buildEntryListStub: sinon.SinonStub = sinon.stub(GenerateCommand, 'buildEntryList');

    GenerateCommand.execute(
        argsMock,
        configModelFixture,
    );

    t.is(buildEntryListStub.calledWithExactly(configModelFixture), true);

    buildEntryListStub.restore();
});
