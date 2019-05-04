import test from 'ava';
import entryModelMocks from '../__mock__/entry-model.mock';
import EntryModel from './entry.model';

test('EntryModel does not throw when passed valid data', (t) => {
    t.notThrows(() => new EntryModel(entryModelMocks.minimalEntryModelMock));
    t.notThrows(() => new EntryModel(entryModelMocks.completeEntryModelMock));
});

test('.generateFileName() returns correct filename when no #issue and no #author is present', (t) => {
    const model = new EntryModel(entryModelMocks.minimalEntryModelMock);
    const expectedResult = `${new Date(model.date).getTime()}.json`;
    const result = model.generateFileName();

    t.is(result, expectedResult);
});

test('.generateFileName() returns correct filename when no #issue is present', (t) => {
    const props = {
        ...entryModelMocks.minimalEntryModelMock,
        author: 'Bob Barker',
    };
    const model = new EntryModel(props);
    const expectedResult = `${new Date(model.date).getTime()}.json`;
    const result = model.generateFileName();


    t.is(result, expectedResult);
});

test('.generateFileName() returns correct filename when #issue is present', (t) => {
    const model = new EntryModel(entryModelMocks.completeEntryModelMock);
    const timestamp = new Date(model.date).getTime();
    const expectedResult = `${timestamp}-${model.issue}-${model.authorNameWithoutSpaces().toLowerCase()}.json`;
    const result = model.generateFileName();

    t.is(result, expectedResult);
});
