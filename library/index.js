// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast-frontmatter`); } catch(error) { debug = function() {}; }
// Node modules.
const assert = require(`assert`);
// Dependency modules.
const parse = require(`planckmatch/parse`),
	match = require(`planckmatch/match`);
const grayMatter = require(`gray-matter`);

/**
 * Validates the module options.
 * @param {Object} options The options.
 */
const validateOptions = function(options) {
	if (!options) {
		return; // Since no option is required.
	}
	
	assert(
		typeof(options) === `object`,
		`hoast-frontmatter: options must be of type object.`
	);
	if (options.options) {
		assert(
			typeof(options.options) === `object`,
			`hoast-frontmatter: options must be of type object.`
		);
	}
	
	if (options.patterns) {
		assert(
			typeof(options.patterns) === `string` || (Array.isArray(options.patterns) && options.patterns.length > 0 && typeof(options.patterns[0] === `string`)),
			`hoast-frontmatter: patterns must be of type string or an array of string.`
		);
	}
	if (options.patternOptions) {
		assert(
			typeof(options.patternOptions) === `object`,
			`hoast-frontmatter: patternOptions must be of type object.`
		);
		if (options.patternOptions.all) {
			assert(
				typeof(options.patternOptions.all) === `boolean`,
				`hoast-frontmatter: patternOptions.all must be of type boolean.`
			);
		}
	}
};

/**
 * Check if expressions match with the given value.
 * @param {String} value The string to match with the expressions.
 * @param {RegExps|Array} expressions The regular expressions to match with.
 * @param {Boolean} all Whether all patterns need to match.
 */
const isMatch = function(value, expressions, all) {
	// If no expressions return early as valid.
	if (!expressions) {
		return true;
	}
	
	const result = match(value, expressions);
	
	// If results is a boolean check if it is true.
	if (typeof(result) === `boolean` && result) {
		return true;
	}
	// If results is an array check whether everything needs to be true or any will be enough.
	if (Array.isArray(result) && (all ? !result.includes(false) : result.includes(true))) {
		return true;
	}
	
	// Otherwise it is no match.
	return false;
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
		options: null,
		patterns: [
			`*.md`,
			`*.markdown`
		],
		patternOptions: {}
	}, options);
	
	const mod = async function(hoast, files) {
		debug(`Running module.`);
		// Loop through files.
		files.map(function(file) {
			debug(`Processing file '${file.path}'.`);
			
			// Check if read module has been used.
			assert(
				file.content !== null,
				`hoast-frontmatter: No content found on file, read module needs to be called before this.`
			);
			
			// Check if file content is text.
			if (file.content.type !== `string`) {
				debug(`File content not valid for processing.`);
				return;
			}
			// Check against glob patterns.
			if (!isMatch(file.path, this.expressions, options.patternOptions.all)) {
				debug(`File path not valid for processing.`);
				return;
			}
			
			// Extract the frontmatter.
			const content = grayMatter(file.content.data, options.options);
			// Write to file`s content and frontmatter.
			file.content.data = content.content;
			file.frontmatter = content.data;
			// If excerpt available add this to the content as well.
			if (content.excerpt) {
				file.content.excerpt = content.excerpt;
			}
			
			debug(`File frontmatter extracted.`);
		}, mod);
	};
	
	mod.before = function() {
		debug(`Running module before.`);
		
		// Parse glob patterns into regular expressions.
		if (options.patterns) {
			this.expressions = parse(options.patterns, options.patternOptions, true);
			debug(`Patterns parsed into expressions: ${this.expressions}.`);
		}
	};
	
	return mod;
};