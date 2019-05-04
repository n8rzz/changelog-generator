const validEntryCommandWithoutArgsMock = {
    _: ['entry'],
};

const validEntryCommandWithHelpMock = {
    _: ['entry'],
    h: true,
};

const validEntryCommandWithArgsMock = {
    _: ['entry'],
    i: 'scm-4321',
    d: 'a changelog entry description would go here',
};

module.exports = {
    validEntryCommandWithoutArgsMock,
    validEntryCommandWithHelpMock,
    validEntryCommandWithArgsMock,
};
