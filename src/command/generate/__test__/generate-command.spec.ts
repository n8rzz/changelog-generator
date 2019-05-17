import test from 'ava';
import inquirer from 'inquirer';
import sinon from 'sinon';
import minimist from 'minimist';
import GenerateCommand from '../generate-command';
import { IChangelog } from '../i-changelog';
import { entryModelFixture } from '../../../__fixture__/entry-model.fixture';

const answersMock: inquirer.Answers = {
    version: '3.2.1-0',
    entries: [],
};

test('.extractEntryValuesFromCliArgs() returns values for only the commands/aliases it needs', (t) => {
    const argsMock: minimist.ParsedArgs = {
        _: ['generate'],
        version: '1.2.3',
        threeve: '737',
    };
    const expectedResult: Partial<IChangelog> = {
        version: '1.2.3',
    };
    const result: Partial<IChangelog> = GenerateCommand.extractEntryValuesFromCliArgs(argsMock);

    t.deepEqual(result, expectedResult);
});

test('.extractEntryValuesFromCliArgs() empty when no command argument/alias is present', (t) => {
    const argsMock: minimist.ParsedArgs = {
        _: ['generate'],
        threeve: '332',
    };
    const expectedResult: Partial<IChangelog> = {};
    const result: Partial<IChangelog> = GenerateCommand.extractEntryValuesFromCliArgs(argsMock);

    t.deepEqual(result, expectedResult);
});

test.serial('.promtChangelogQuestions() uses passed version as default', async (t) => {
    const argValuesMock: Partial<IChangelog> = { version: '4.4.4' };
    const promptStub: sinon.SinonStub = sinon.stub(inquirer, 'prompt').resolves(answersMock);

    await GenerateCommand.promptChangelogQuestions(argValuesMock, [entryModelFixture]);

    const versionQuestionProps = promptStub.firstCall.args[0][0];

    t.is(versionQuestionProps.default, argValuesMock.version);

    promptStub.restore();
});

test.serial('.promtChangelogQuestions() uses empty string as version default when not passed', async (t) => {
    const argValuesMock: Partial<IChangelog> = {};
    const promptStub: sinon.SinonStub = sinon.stub(inquirer, 'prompt').resolves(answersMock);

    await GenerateCommand.promptChangelogQuestions(argValuesMock, [entryModelFixture]);

    const versionQuestionProps = promptStub.firstCall.args[0][0];

    t.is(versionQuestionProps.default, '');

    promptStub.restore();
});
