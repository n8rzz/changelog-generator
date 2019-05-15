import test from "ava";
import ChangelogModel from '../changelog.model';
import { IChangelog } from "../i-changelog";
import {
    validChangelogPropsMock,
    validChangelogWithEntriesMock,
} from '../../../__mock__/changelog-model.mock';
import {
    featureEntryModelFixture,
    bugfixEntryModelFixture,
    bugfixEntryModelWithExtendedDescriptionFixture,
} from '../../../__fixture__/entry-model.fixture';
import EntryModel from "src/command/entry/entry.model";
import {
    validEntryGroupFixture
} from '../../../__fixture__/entry-group.fixture';

const entryListMock: EntryModel[] = [
    featureEntryModelFixture,
    bugfixEntryModelFixture,
    bugfixEntryModelWithExtendedDescriptionFixture,
];

const rawSelectionListMock = entryListMock.map((entryModel: EntryModel): string => entryModel.buildCheckboxLabel());

test('ChangelogModel does not throw when passed valid props', (t) => {
    t.notThrows(() => new ChangelogModel({} as IChangelog));
    t.notThrows(() => new ChangelogModel(validChangelogPropsMock));
    t.notThrows(() => new ChangelogModel(validChangelogWithEntriesMock));
});

test.only('.buildChangelogFromAnswers() returns `sortedEntryGroup` when all entries have been selected', (t) => {
    const cmd: ChangelogModel = new ChangelogModel(validChangelogPropsMock);

    cmd.buildChangelogFromAnswers(rawSelectionListMock, entryListMock, validEntryGroupFixture);

    t.deepEqual(cmd.entries, validEntryGroupFixture);
});

test.skip('.buildChangelogFromAnswers() returns selected entries when only some have been selected', () => {});
