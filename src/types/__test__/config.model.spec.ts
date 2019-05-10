import test from 'ava';
import ConfigModel from '../config.model';
import { validConfigModelMock } from '../../__mock__/config-model.mock';

test('ConfigModel does not throw when passed valid data', (t) => {
    // eslint-disable-next-line arrow-body-style
    t.notThrows(() => new ConfigModel({ ...validConfigModelMock }));
});

test('.toJson() serializes instance into a string', (t) => {
    const model = new ConfigModel(validConfigModelMock);
    const result = model.toJson();

    t.true(typeof result === 'string');
});
