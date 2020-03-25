<div>
    <a href="https://circleci.com/gh/AmatsuyuKun/Optimist">
        <img src="https://circleci.com/gh/AmatsuyuKun/Optimist.svg?style=svg" alt="CircleCI Status"/>
    </a>
</div>

<div align="center">
    <img src="img/optimist.png" alt="Optimist" width="200px"/>
</div>

<h2 align="center">♻️ Optimize options list</h2>

Simply maps common command-line options to an `object`, turning their values to literal types.

## Table of Contents

- [Usage](#usage)
    - [Options and Values](#options-and-values)
    - [Defaults and Aliases](#defaults-and-aliases)
    - [Returned Value](#returned-value)
- [References](#references)
- [Contributing](#contributing)
- [License](#license)

## Usage

Get started by simply requiring optimist module and define an optional default values:

```javascript
const optimist = require('optimist');

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

console.log(optimist(process.argv.slice(2), defaults));
```

Now, if we execute our script with the following arguments:

```bash
node <script.js> --option1 string --option2 -opt3 -1.1 -opt4=undefined
```

It will output an optimized representation of the given options:

```javascript
{
    _: [],
    option1: 'string',
    option2: true,
    option3: -1.1,
    option4: undefined
}
```

### Options and Values

Valid options syntax are marked with a `--` or `-`, and values are separated with a space or `=`. Single options are parsed with an implicit `true` value.

Number values like `-1.1` are treated as both an option or a value depending on the position of arguments, e.g in `-123=value` and `--option=-123`, the former is an option name while the latter is a value. Values such as `boolean`, `number`, `null`, or `undefined` types are parsed as literals. Others will remain as raw string.

### Defaults and Aliases

Referring to the above example, the given defaults are used to determine if the actual command-line arguments contains valid or invalid options as well as provide default values to those options not explicitly specified. Such defaults are defined as the following:

- `option1`: Represents an option with a single default value.
    - Matches: `--option1 'string'` or `--option1=string`
- `option2`: Represents an option with multiple required values.
    - Matches: `--option2` or `--option2=false`
- `option3`: Represents an option with a single default value including an alias.
    - Matches: `--option3 -1.1` or `-opt3=-1.1`
- `option4`: Represents an option with multiple required values including an alias.
    - Matches: `--option4 null` or `-opt4=undefined`

> **Note:** For multiple values, the actual default value is the first element (index `[0]`), e.g in `[true, false]`, `true` is the default value.

> **Note:** Use the `aliases` property to define a name alias. Doing so, will let you use the `defaults` property for default values. Aliases will always return their exact `option` name, e.g, `--opt3=value` will return `option3`:`value`.

### Returned Value

The returned `object` contains an `option`:`value` pairs including a `['_']` property containing a list of all invalid options. An invalid option is captured if its name or value is not defined in the defaults. If there are no provided defaults, then only the syntax will be parsed.

## References

Optimist is designed to be just simple. If you didn't find what you're looking for, try [minimist](https://www.npmjs.com/package/minimist) instead.

## Contributing

Fork or star this repository to give a positive feedback :heavy_heart_exclamation:. Send bug reports, and other issues [here](https://github.com/AmatsuyuKun/Optimist/issues).

## License

Copyright 2020 Jōro. Use of this source code is governed by the MIT license that can be found in the [LICENSE](LICENSE) file or at https://opensource.org/licenses/MIT.
