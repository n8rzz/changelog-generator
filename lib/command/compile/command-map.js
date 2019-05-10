const CliCommandModel = require('../../types/cli-arg.model');

module.exports = {
    author: new CliCommandModel({
        arg: 'dry-run',
        alias: 'd',
    }),
    description: new CliCommandModel({
        arg: 'version',
    }),
    email: new CliCommandModel({
        arg: 'filename',
    }),
};
