<div align="center">
  
  [![npm package @latest](https://img.shields.io/npm/v/hoast-frontmatter.svg?label=npm@latest&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast-frontmatter)
  [![npm package @next](https://img.shields.io/npm/v/hoast-frontmatter/next.svg?label=npm@next&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast-frontmatter/v/next)
  
  [![Travis-ci status](https://img.shields.io/travis-ci/hoast/hoast-frontmatter.svg?branch=master&label=test%20status&style=flat-square&maxAge=3600)](https://travis-ci.org/hoast/hoast-frontmatter)
  [![CodeCov coverage](https://img.shields.io/codecov/c/github/hoast/hoast-frontmatter/master.svg?label=test%20coverage&style=flat-square&maxAge=3600)](https://codecov.io/gh/hoast/hoast-frontmatter)
  
  [![License agreement](https://img.shields.io/github/license/hoast/hoast-frontmatter.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast-frontmatter/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/hoast/hoast-frontmatter.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast-frontmatter/issues)
  
</div>

# hoast-frontmatter

Extracts frontmatter from files.

> As the name suggest this is a [hoast](https://github.com/hoast/hoast#readme) module.

## Usage

Install [hoast-frontmatter](https://npmjs.com/package/hoast-frontmatter) using [npm](https://npmjs.com).

```
$ npm install hoast-frontmatter
```

### Parameters

* `options`: [gray-matter options](https://github.com/jonschlinkert/gray-matter#options), see it`s documentation for more detail.
  * Type: `Object`
	* Required: `no`
* `patterns`: Glob patterns to match file paths with. If the engine function is set it will only give the function any files matching the pattern.
  * Type: `String` or `Array of strings`
	* Default: `[ '*.md', '*.markdown' ]`
* `patternOptions`: Options for the glob pattern matching. See [planckmatch options](https://github.com/redkenrok/node-planckmatch#options) for more details on the pattern options.
  * Type: `Object`
  * Default: `{}`
* `patternOptions.all`: This options is added to `patternOptions`, and determines whether all patterns need to match instead of only one.
  * Type: `Boolean`
  * Default: `false`

### Example

**Cli**

```json
{
  "modules": {
    "read": {},
    "hoast-frontmatter": {}
  }
}
```

**Script**

```javascript
const Hoast = require(`hoast`);
const read = Hoast.read,
      frontmatter = require(`hoast-frontmatter`);

Hoast(__dirname)
  .use(read())
  .use(frontmatter())
  .process();
```

> By default it will extract the YAML frontmatter from any markdown files.

## License

[ISC license](https://github.com/hoast/hoast-filter/blob/master/LICENSE)