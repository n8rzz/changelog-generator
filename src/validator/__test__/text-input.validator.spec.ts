import test from 'ava';
import { textInputValidator } from '../text-input.validator';

test('.textInputValidator() returns true when passed a string', (t) => {
    t.is(textInputValidator('threeve'), true);
});

test('.textInputValidator() when passed an empty string returns an error msg', (t) => {
    t.is(textInputValidator(''), 'Please provide a value');
});
