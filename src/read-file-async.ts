const fs = require('fs');
const util = require('util');

export const readFileAsync = util.promisify(fs.readFile);
