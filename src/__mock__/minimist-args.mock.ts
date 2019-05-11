import * as minimist from 'minimist';

export const validEntryCommandWithoutArgsMock: Partial<minimist.ParsedArgs> = {
    _: ['entry'],
};

export const validEntryCommandWithHelpMock: Partial<minimist.ParsedArgs> = {
    _: ['entry'],
    h: true,
};

export const validEntryCommandWithArgsMock: minimist.ParsedArgs = {
    _: ['entry'],
    i: 'scm-4321',
    d: 'a changelog entry description would go here',
};
