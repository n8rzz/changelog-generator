import fs from 'fs';
import util from 'util';

export const writeFileAsync = util.promisify(fs.writeFile);
