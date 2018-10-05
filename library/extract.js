/**
 * Extract JSON front matter from string.
 * @param {String} filePath Path of file.
 * @param {String} content File content
 */
const extract = function(filePath, content) {
	// Remove starting or ending blank space.
	content = content.trimLeft();
	let frontmatter = {};
	
	// Return if content to short or front matter does not start with open brace.
	if (content.length <= 1 || content[0] !== `{`) {
		return {
			content: content,
			frontmatter: frontmatter
		};
	}
	
	// Amount of open braces passed.
	let opened = 1;
	let lastIndex = 0;
	// Length of content text.
	const contentLength = content.length;
	// Iterate over content text.
	for (let i = 1; i < contentLength; i++) {
		// Get current character.
		const character = content[i];
		if (character === `{`) {
			// If opening brace increment.
			opened++;
		} else if (character === `}`) {
			// If closing brace decrement.
			opened--;
		}
		
		// If none open anymore final character found.
		if (opened === 0) {
			lastIndex = i + 1;
			break;
		}
	}
	
	if (lastIndex > 0) {
		// Parse front matter section.
		frontmatter = JSON.parse(content.substring(0, lastIndex));
		// Get text after frontmatter section.
		content = content.substring(lastIndex).trim();
	}
	
	// Return results.
	return {
		content: content,
		frontmatter: frontmatter
	};
};

module.exports = extract;