import test from 'ava';
import ConfigModel from './config.model';
import configModelMock from '../__mock__/config-model.mock';

test('ConfigModel does not throw when passed valid data', (t) => {
    t.notThrows(() => new ConfigModel(configModelMock.validConfigModelMock));
});

test('.toJson() serializes instance into a string', (t) => {
    const model = new ConfigModel(configModelMock.validConfigModelMock);
    const result = model.toJson();

    t.true(typeof result === 'string');
});
