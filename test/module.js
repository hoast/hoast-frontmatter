// Dependency modules.
const test = require(`ava`);
// Custom module.
const Frontmatter = require(`../library`);

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
	const frontmatter = Frontmatter();
	await frontmatter({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});