# Hoast-frontmatter
Extracts frontmatter from files.

> As the name suggest this is a [hoast](https://github.com/hoast/hoast#readme) module.

## Usage

Install [hoast-frontmatter](https://npmjs.com/package/hoast-frontmatter) using [npm](https://npmjs.com).

```
$ npm install hoast-frontmatter
```

### Parameters

* `options` **{String}**: [gray-matter](https://github.com/jonschlinkert/gray-matter#gray-matter) options, see it's documentation for more detail.
	* Required: `no`
* `patterns` **{Array of strings}**: Gets used to match files using glob patterns. See [nanomatch](https://github.com/micromatch/nanomatch#readme) for more details on the patterns.
	* Default: `[ '**/*.md' ]`

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
const Hoast = require('hoast');
const read = Hoast.read,
      frontmatter = require('hoast-frontmatter');

Hoast(__dirname)
  .use(read())
  .use(frontmatter())
  .process();
```

> By default it will extract the YAML frontmatter from any markdown files.

## License

[ISC license](https://github.com/hoast/hoast-filter/blob/master/LICENSE)