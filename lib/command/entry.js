
// async function _extractUserEmail() {
//     const cmd = 'git config user.email';
//     const defaultValue = '';
//     const errorMsg = 'An error occurred.  Oops, no biggie.';

//     return execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);
// }

// async function _extractUserName() {
//     const cmd = 'git config user.name';
//     const defaultValue = '';
//     const errorMsg = 'An error occurred.  Oops, no biggie.';

//     return execWithDefaultAndErrorMsg(cmd, defaultValue, errorMsg);
// }

function entryCommand(args, options) {
    console.log('.entryCommand()\n', args, '\n', options);
}

module.exports = entryCommand;
