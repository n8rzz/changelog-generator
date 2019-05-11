import test from 'ava';
import EntryModel from '../entry.model';
import {
    minimalEntryModelMock,
    completeEntryModelMock,
} from './entry-model.mock';

test('EntryModel does not throw when passed valid data', (t) => {
    // eslint-disable-next-line arrow-body-style
    t.notThrows(() => new EntryModel(minimalEntryModelMock));
    // eslint-disable-next-line arrow-body-style
    t.notThrows(() => new EntryModel(completeEntryModelMock));
});

test('.generateFileName() returns correct filename when no #issue and no #author is present', (t) => {
    const model = new EntryModel(minimalEntryModelMock);
    const expectedResult = `${new Date(model.date).getTime()}.json`;
    const result = model.generateFileName();

    t.is(result, expectedResult);
});

test('.generateFileName() returns correct filename when no #issue is present', (t) => {
    const props = {
        ...minimalEntryModelMock,
        author: 'Bob Barker',
    };
    const model = new EntryModel(props);
    const expectedResult = `${new Date(model.date).getTime()}.json`;
    const result = model.generateFileName();

    t.is(result, expectedResult);
});

test('.generateFileName() returns correct filename when #issue is present', (t) => {
    const model = new EntryModel(completeEntryModelMock);
    const timestamp = new Date(model.date).getTime();
    const expectedResult = `${timestamp}-${model.issue}-${model.authorNameWithoutSpaces().toLowerCase()}.json`;
    const result = model.generateFileName();

    t.is(result, expectedResult);
});
