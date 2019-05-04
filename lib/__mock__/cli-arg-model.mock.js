const validArgWithoutAliasMock = {
    arg: 'issue',
};

const validCliArgMock = {
    ...validArgWithoutAliasMock,
    alias: 'i',
};

module.exports = {
    validArgWithoutAliasMock,
    validCliArgMock,
};
