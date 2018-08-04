// Node modules.
const assert = require('assert');
// If debug available require it.
let debug; try { debug = require('debug')('hoast-frontmatter'); } catch(error) { debug = function() {}; }
// Dependency modules.
const nanomatch = require('nanomatch'),
	  grayMatter = require('gray-matter');

/**
 * Validates the module options.
 * @param {Object} options The options.
 */
const validateOptions = function(options) {
	assert(typeof(options) === 'object', 'hoast-frontmatter: options must be of type object.');
	if (options.options) {
		assert(typeof(options.options) === 'object', 'hoast-frontmatter: options must be of type object.');
	}
	if (options.patterns) {
		assert(Array.isArray(options.patterns)  && options.patterns.length, 'hoast-frontmatter: patterns needs must be specified and an array of strings.');
	}
};

/**
 * Extracts the frontmatter from files.
 * @param {Object} options The module options.
 */
module.exports = function(options) {
	debug(`Initializing module.`);
	
	validateOptions(options);
	debug(`Validated options.`);
	options = Object.assign({
		options: {},
		patterns: [
			'**/*.md'
		]
	}, options);
	
	return async function(hoast, files) {
		debug(`Running module.`);
		await Promise.all(
			// Loop through files.
			files.map(function(file) {
				return new Promise(function(resolve) {
					debug(`Processing file '${file.path}'.`);
					
					assert(file.content !== null, 'hoast-frontmatter: No content found on file, read module needs to be called before this.');
					// Has to be a string and match patterns.
					if (file.content.type !== 'string' || (options.patterns && options.patterns.length > 0 && !nanomatch.any(file.path, options.patterns))) {
						debug(`File not valid for processing.`);
						return resolve();
					}
					debug(`File content is valid.`);
					
					// Extract the frontmatter.
					let content = grayMatter(file.content.data, options.options);
					// Write to file's content and frontmatter.
					file.content.data = content.content;
					file.content.excerpt = content.excerpt;
					file.frontmatter = content.data;
					
					debug(`File frontmatter extracted.`);
					resolve();
				})
			})
		);
	};
};