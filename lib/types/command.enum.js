const t = require('tcomb');

/**
 * Enum of available top-level commands
 *
 * @type CommandEnum
 */
const CommandEnum = t.enums.of([
    'init',
    'entry',
    'compile',
], 'CommandEnum');

module.exports = CommandEnum;
