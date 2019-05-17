/* eslint-disable arrow-body-style */
import test from 'ava';
import ChangelogModel from '../changelog.model';
import { validChangelogAnswersProps } from '../../../__mock__/changelog-model.mock';
import {
    featureEntryModelFixture,
    bugfixEntryModelFixture,
    bugfixEntryModelWithExtendedDescriptionFixture,
} from '../../../__fixture__/entry-model.fixture';
import EntryModel from '../../entry/entry.model';
import {
    validEntryGroupFixture,
} from '../../../__fixture__/entry-group.fixture';

let entryListMock: EntryModel[];
let rawSelectionListMock: string[];

test.before(() => {
    entryListMock = [
        featureEntryModelFixture,
        bugfixEntryModelFixture,
        bugfixEntryModelWithExtendedDescriptionFixture,
    ];
    rawSelectionListMock = entryListMock.map((entryModel: EntryModel): string => entryModel.buildCheckboxLabel());
});

test.after(() => {
    entryListMock = [];
    rawSelectionListMock = [];
});

test('ChangelogModel does not throw when passed valid props', (t) => {
    const answersWithSelectionlist = {
        ...validChangelogAnswersProps,
        entries: rawSelectionListMock,
    };
    t.notThrows(() => new ChangelogModel(validChangelogAnswersProps, entryListMock, validEntryGroupFixture));
    t.notThrows(() => new ChangelogModel(answersWithSelectionlist, entryListMock, validEntryGroupFixture));
});
