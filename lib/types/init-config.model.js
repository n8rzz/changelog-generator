const t = require('tcomb');

const InitConfigModel = t.struct({
    projectName: t.String,
    isLastTagCorrect: t.Boolean,
}, 'InitConfigModel');

module.exports = InitConfigModel;
