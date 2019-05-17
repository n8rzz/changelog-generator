/* eslint-disable max-len */
import EntryModel from '../command/entry/entry.model';
import { completeEntryModelMock } from '../__mock__/entry-model.mock';

export const entryModelFixture: EntryModel = new EntryModel(completeEntryModelMock);

export const featureEntryModelFixture: EntryModel = new EntryModel({
    author: 'Steve Perry',
    date: new Date().toUTCString(),
    email: 'steve.perry@aerosmith.com',
    issueSourceUrl: 'http://github.com/n8rzz/gbrdm',
    skipFilenameCheck: false,
    description: 'These are the words that make up a Changelog Entry description',
    issue: 'abc-7766',
    type: 'feature',
});

export const bugfixEntryModelFixture: EntryModel = new EntryModel({
    author: 'Steve Perry',
    date: new Date().toUTCString(),
    email: 'steve.perry@aerosmith.com',
    issueSourceUrl: 'http://github.com/n8rzz/gbrdm',
    skipFilenameCheck: false,
    description: 'These are the words that make up a Changelog Entry description',
    issue: 'abc-7700',
    type: 'bugfix',
});

export const bugfixEntryModelWithExtendedDescriptionFixture: EntryModel = new EntryModel({
    author: 'Bob Barker',
    date: new Date().toUTCString(),
    email: 'bob.barker@priceisright.com',
    issueSourceUrl: 'http://github.com/n8rzz/gbrdm',
    skipFilenameCheck: false,
    description: 'Ancient alien Machu Picchu Mayan earth mound von Daniken, vimana sightings alien space brothers golden disk NASA, megoliths ancient alien weightless space time. Helicopter heiroglyph sightings sun disc vimana earth mound sky people anti-gravity, cover up alien pyramids portal, I know it sounds crazy... Foo fighter electromagnetic cover up spaceships.',
    issue: 'abc-6577',
    type: 'bugfix',
});
