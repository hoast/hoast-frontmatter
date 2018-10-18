// Dependency modules.
const Hoast = require(`hoast`),
	test = require(`ava`);
// Custom module.
const Frontmatter = require(`../library`);

/**
 * Emulates a simplified Hoast process for testing purposes.
 * @param {Object} options Hoast options.
 * @param {Function} mod Module function.
 * @param {Array of objects} files The files to process and return.
 */
const emulateHoast = async function(options, mod, files) {
	const hoast = Hoast(__dirname, options);
	
	if (mod.before) {
		await mod.before(hoast);
	}
	
	const temp = await mod(hoast, files);
	if (temp) {
		files = temp;
	}
	
	if (mod.after) {
		await mod.after(hoast);
	}
	
	return files;
};

test(`default`, async function(t) {
	// Create dummy files.
	const files = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: `{"title": "a"} content`
		}
	}, {
		path: `b.md`,
		content: {
			type: `string`,
			data: `{"title": "b"} content`
		}
	}, {
		path: `c.md`,
		content: {
			type: `string`,
			data: `{"title": "c"}, {"title": "d"} content`
		}
	}, {
		path: `d.md`,
		content: {
			type: `string`,
			data: `{"title": "d", "author": { "name": "john" }} content`
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: `{"title": "a"} content`
		}
	}, {
		path: `b.md`,
		content: {
			type: `string`,
			data: `content`
		},
		frontmatter: {
			title: `b`
		}
	}, {
		path: `c.md`,
		content: {
			type: `string`,
			data: `, {"title": "d"} content`
		},
		frontmatter: {
			title: `c`
		}
	}, {
		path: `d.md`,
		content: {
			type: `string`,
			data: `content`
		},
		frontmatter: {
			title: `d`,
			author: {
				name: `john`
			}
		}
	}];
	
	// Test module.
	await emulateHoast(
		{},
		Frontmatter(),
		files
	);
	
	// Compare files.
	t.deepEqual(files, filesOutcome);
});