import test from 'ava';
import InitConfigModel from './init-config.model';
import initConfigModelMocks from '../__mock__/init-config-model.mock';

test('InitConfigModel does not throw when passed valid data', (t) => {
    t.notThrows(() => new InitConfigModel(initConfigModelMocks.validInitConfigModelMock));
});
