const compile = require('./compile/compile');
const { entryCommand } = require('./entry/entry');

module.exports = {
    compile,
    entry: entryCommand,
};
