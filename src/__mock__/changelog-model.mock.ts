import { IChangelog } from '../command/generate/i-changelog';
import { validEntryGroupFixture } from '../__fixture__/entry-group.fixture';

export const validChangelogPropsMock: IChangelog = {
    version: '1.2.3',
    date: new Date(),
    entries: {},
};

export const validChangelogWithEntriesMock: IChangelog = {
    version: '1.2.3',
    date: new Date(),
    entries: validEntryGroupFixture,
};
