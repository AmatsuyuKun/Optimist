'use strict';

const optimist = require('../lib/index');

const defaults = {
    option1: 'string',
    option2: [true, false],
    option3: {
        defaults: -1.1,
        aliases: 'opt3'
    },
    option4: {
        defaults: [null, undefined],
        aliases: ['opt4']
    }
};

process.argv.push('--option1', 'string', '-option2', '--opt3', -1.1, '-opt4=undefined');

const options = optimist(process.argv.slice(2), defaults);

test('Options should match defaults', () => {
    for (let [option, value] of Object.entries(options)) {
        if (option === '_') {
            expect(options['_'].length).toBe(0);
            continue;
        }
        expect(option in defaults).toBe(true);
        let values = defaults[option];
        values = [].concat(values.hasOwnProperty('defaults')
            ? values['defaults']
            : values);
        expect(values.includes(value)).toBe(true);
    }
});
