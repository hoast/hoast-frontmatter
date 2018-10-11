// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast-frontmatter`); } catch(error) { debug = function() {}; }
// Node modules.
const assert = require(`assert`);
// Dependency modules.
const parse = require(`planckmatch/parse`),
	match = require(`planckmatch/match`);
const extract = require(`./extract`);

/**
 * Validates the module options.
 * @param {Object} options The options.
 */
const validateOptions = function(options) {
	if (!options) {
		// Return since no option is required.
		return;
	}
	
	assert(
		typeof(options) === `object`,
		`hoast-frontmatter: options must be of type object.`
	);
	
	/**
	 * Validate a potential array.
	 * @param {Object} property Name of property to validate.
	 * @param {String} type Object type.
	 */
	const validateArray = function(property, type) {
		property = options[property];
		const message = `hoast-frontmatter: ${property} must be of type ${type} or an array of ${type}s.`;
		if (Array.isArray(property)) {
			property.forEach(function(item) {
				assert(
					typeof(item) === type,
					message
				);
			});
		} else {
			assert(
				typeof(property) === type,
				message
			);
		}
	};
	
	if (options.engine) {
		assert(
			typeof(options.engine) === `function`,
			`hoast-frontmatter: engine must be of type function.`
		);
	}
	
	if (options.patterns) {
		validateArray(`patterns`, `string`);
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
	
	// If results is an array.
	if (Array.isArray(result)) {
		// Check whether all or just any will result in a match, and return the outcome.
		return all ? !result.includes(false) : result.includes(true);
	}
	
	// Otherwise result is a boolean and can be returned directly.
	return result;
};

/**
 * Extracts the front matter from files.
 * @param {Object} options The module options.
 */
module.exports = function(options) {
	debug(`Initializing module.`);
	
	validateOptions(options);
	debug(`Validated options.`);
	options = Object.assign({
		patterns: [
			`*.md`
		],
		patternOptions: {}
	}, options);
	
	const mod = async function(hoast, files) {
		debug(`Running module.`);
		// Loop through files.
		files.forEach(function(file) {
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
			
			// Extract the front matter.
			const result = options.engine ? options.engine(file.path, file.content.data) : extract(file.path, file.content.data);
			// Write to file`s content and front matter.
			file.content.data = result.content;
			file.frontmatter = result.frontmatter;
			
			debug(`File frontmatter extracted from content.`);
		}, mod);
	};
		
	// Parse glob patterns into regular expressions.
	if (options.patterns) {
		mod.expressions = parse(options.patterns, options.patternOptions, true);
		debug(`Patterns parsed into expressions: ${mod.expressions}.`);
	}
	
	return mod;
};