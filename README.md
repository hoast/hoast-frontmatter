<div align="center">
  <a title="Version master branch" href="https://github.com/hoast/hoast-frontmatter#readme" target="_blank" rel="noopener">
    <img src="https://img.shields.io/github/package-json/v/hoast/hoast-frontmatter.svg?label=master&style=flat-square"/>
  </a>
  <a title="Version npm package" href="https://npmjs.com/package/hoast-frontmatter" target="_blank" rel="noopener">
    <img src="https://img.shields.io/npm/v/hoast-frontmatter.svg?label=npm&style=flat-square"/>
  </a>
  <a title="License agreement" href="https://github.com/hoast/hoast-frontmatter/blob/master/LICENSE" target="_blank" rel="noopener">
    <img src="https://img.shields.io/github/license/hoast/hoast-frontmatter.svg?style=flat-square"/>
  </a>
  <a title="Travis-ci build statis" href="https://travis-ci.org/hoast/hoast-frontmatter" target="_blank" rel="noopener">
    <img src="https://img.shields.io/travis-ci/hoast/hoast-frontmatter.svg?branch=master&style=flat-square"/>
  </a>
  <a title="Open issues on GitHub" href="https://github.com/hoast/hoast-frontmatter/issues" target="_blank" rel="noopener">
    <img src="https://img.shields.io/github/issues/hoast/hoast-frontmatter.svg?style=flat-square"/>
  </a>
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

* `options` **{String}**: [gray-matter](https://github.com/jonschlinkert/gray-matter#gray-matter) options, see it`s documentation for more detail.
	* Required: `no`
* `patterns` **{Array|strings}**: A string or an array of strings which gets used to match files using glob patterns. See [nanomatch](https://github.com/micromatch/nanomatch#readme) for more details on the patterns.
	* Default: `[ '**/*.md', '**/*.markdown' ]`

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