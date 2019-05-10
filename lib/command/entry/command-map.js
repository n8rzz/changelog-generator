const CliCommandModel = require('../../types/cli-arg.model');

module.exports = {
    author: new CliCommandModel({
        arg: 'author',
        alias: 'a',
    }),
    description: new CliCommandModel({
        arg: 'description',
        alias: 'd',
    }),
    email: new CliCommandModel({
        arg: 'email',
        alias: 'e',
    }),
    issue: new CliCommandModel({
        arg: 'issue',
        alias: 'i',
    }),
    type: new CliCommandModel({
        arg: 'type',
        alias: 't',
    }),
    skipFilenameCheck: new CliCommandModel({
        arg: 'skipFilenameCheck',
        alias: 'f',
    }),
    date: new CliCommandModel({
        arg: 'date',
    }),
};
