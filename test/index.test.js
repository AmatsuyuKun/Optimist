'use strict';

// Import optimist module:
const optimist = require('../lib/index');

// Default options are parsed against the specified command-line arguments.
// If an argument is not defined in the defaults, then it is considered an unknown.
// If there are no given defaults, then only the syntax will be parsed.
const defaults = {
    // `option1`: Represents an option with single default value.
    option1: 'string',
    // `option2`: Represents an option with multiple required values.
    // **Note:** The first element will be the default value for this option.
    option2: [true, false],
    // `option3`: Represents an option with single default value and an alias.
    // Use the `aliases` property to define option name alias.
    // It can be an array of strings or a single string value.
    // Only use `defaults` property if you're going to define an alias.
    option3: {
        defaults: -1.1,
        aliases: 'opt3'
    },
    // `option4`: Represents an option with multiple required values and an alias.
    option4: {
        defaults: [null, undefined],
        aliases: ['opt4']
    }
};

// Add command-line arguments here:
process.argv.push('--option1', 'string', '-option2', '--opt3', -1.1, '-opt4=undefined');

// Returns the optimized options values:
const options = optimist(process.argv.slice(2), defaults);

// Now let's test if the command-line arguments matched our default values.
test('Options should match defaults', () => {
    for (let [option, value] of Object.entries(options)) {
        // Unknown options are captured in the `['_']` property.
        // If its items length is non-zero, then our test will fail.
        if (option === '_') {
            expect(options['_'].length).toBe(0);
            continue;
        }
        // Also, expect all specified arguments are defined in the defaults.
        expect(option in defaults).toBe(true);
        let values = defaults[option];
        values = [].concat(values.hasOwnProperty('defaults')
            ? values['defaults']
            : values);
        expect(values.includes(value)).toBe(true);
    }
});
