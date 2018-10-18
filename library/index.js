// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast-frontmatter`); } catch(error) { debug = function() {}; }
// Custom modules.
const extract = require(`./extract`);

/**
 * Extracts the front matter from files.
 * @param {Object} options The module options.
 */
module.exports = function(options) {
	debug(`Initializing module.`);
	
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
			if (file.content === null) {
				debug(`File content not set, read module needs to be called before this.`);
				return;
			}
			
			// Check if file content is text.
			if (file.content.type !== `string`) {
				debug(`File content not valid for processing.`);
				return;
			}
			// Check against glob patterns.
			if (!hoast.helper.match(file.path, this.expressions, options.patternOptions.all)) {
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
	
	mod.before = function(hoast) {
		// Parse glob patterns into regular expressions.
		if (options.patterns) {
			this.expressions = hoast.helper.parse(options.patterns, options.patternOptions, true);
			debug(`Patterns parsed into expressions: ${this.expressions}.`);
		}
	};
	
	return mod;
};