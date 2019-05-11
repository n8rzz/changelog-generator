import EntryModel from '../command/entry/entry.model';
import { completeEntryModelMock } from '../command/entry/__test__/entry-model.mock';

export const entryModelFixture = new EntryModel(completeEntryModelMock);
