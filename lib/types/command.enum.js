const t = require('tcomb');

const CommandEnum = t.enums.of([
    'entry',
    'compile'
], 'CommandEnum');

module.exports = CommandEnum;
