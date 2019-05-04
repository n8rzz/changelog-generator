import test from 'ava';
import CommandEnum from './command.enum';

test('CommandEnum', (t) => {
    t.is(CommandEnum.meta.map.compile, 'compile');
    t.is(CommandEnum.meta.map.entry, 'entry');
    t.is(CommandEnum.meta.map.init, 'init');
});
