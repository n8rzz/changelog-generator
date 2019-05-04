/**
 * Validate text input values
 *
 * @function textInputValidator
 * @param {string|undefined} input  user input value
 * @returns {true|string}
 */
function textInputValidator(input) {
    if (typeof input === 'string' && input.length > 0) {
        return true;
    }

    return 'Please provide a value';
}

module.exports = textInputValidator;
