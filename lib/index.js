'use strict';

/**
* Optimize options list.
* @param {Array} argv - List of options to be optimized.
* @param {Object} mappings - A map of possible option values.
* @author Jōro
*/
module.exports = (argv = [], mappings = {}) => {
  // Contains all parsed options in an `option`:`value` pairs.
  // The `options['_']` property will contain an array of unknown options.
  let options = {_: []};
  // Turn `values` into a single array.
  const flatten = (...values) => [].concat(...values);
  // Deconstructs and flatten an array or an object with certain property.
  const deconstruct = (maps, property) =>
    flatten(maps.hasOwnProperty(property)
      ? maps[property]
      : maps);
  // Initialize default mapped values.
  for (let [option, maps] of Object.entries(mappings)) {
    let defaults = deconstruct(maps, 'defaults');
    options = {...options, [option]: defaults[0]};
  }
  // Isolates unknown options.
  const unknown = (arg) => {
    if (!options['_'].includes(arg)) {
      // `options['_']` property may also be mapped with a default value,
      // so we flatten it to always return an array regardless of its defined value.
      options['_'] = flatten(options['_'], arg);
    }
  };
  // Turns a `value` to its literal type.
  const literal = (value) => {
    let _value = String(value).toLowerCase();
    if (/^true|false$/.test(_value)) {
      return /^true$/.test(_value) || false;
    } else if (/^[+-]?[\.0-9]+$/.test(_value)) {
      return Number(_value);
    } else if (/^null$/.test(_value)) {
      return null;
    } else if (/^undefined$/.test(_value)) {
      return undefined;
    }
    return value;
  };
  // Handles option assignments.
  const assign = ([arg, key, value]) => {
    let _value = literal(value);
    if (Object.keys(mappings).length === 0) {
      options = {...options, [key]: _value};
    } else {
      for (let [option, maps] of Object.entries(mappings)) {
        let aliases = flatten(maps['aliases']);
        let defaults = deconstruct(maps, 'defaults');
        let _key = key === option || aliases.includes(key) ? option : key;
        // Ensure that `aliases` always refer to their exact `option` name,
        // and the `value` is defined within the `defaults` list.
        if (_key === option && defaults.includes(_value)) {
          options = {...options, [_key]: _value};
          return;
        }
      }
      unknown(arg);
    }
  };
  // Parse options list.
  for (let i = 0; i < argv.length; i++) {
    let arg = argv[i];
    if (/^--?.+=.+/.test(arg)) {
      // Matches the pattern: `--option=value` or `-option=value`
      let tokens = arg.match(/^--?(.+)=(.+)/);
      assign(tokens);
    } else if (/^--?.+/.test(arg)) {
      // Matches the pattern: `--option` or `-option`
      let tokens = arg.match(/^--?(.+)/);
      let next = argv[i + 1];
      if (/^[+-]?[\.0-9]+$/.test(next) || !/^--?.+/.test(next)) {
        // If the `next` option is not a valid option, then use that value.
        tokens[0] = `${tokens[0]} ${next}`;
        tokens = tokens.concat(next);
        i++;
      } else {
        // Otherwise, use a default `true` value.
        tokens = tokens.concat(true);
      }
      assign(tokens);
    } else {
      unknown(arg);
    }
  }
  // Return the `options` object.
  return options;
};
