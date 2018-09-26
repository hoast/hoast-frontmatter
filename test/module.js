// Dependency modules.
const test = require(`ava`);
// Custom module.
const Frontmatter = require(`../library`);

test(`frontmatter`, async function(t) {
	// Create module options.
	const options = {
		options: {
			excerpt: true
		},
		patterns: `*.md`
	};
	
	// Create dummy files.
	const files = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: `---\ntitle: a\n---\ncontent`
		}
	}, {
		path: `b.md`,
		content: {
			type: `string`,
			data: `---\ntitle: b\n---\ncontent---more`
		}
	}];
	
	// Expected outcome.
	const filesOutcome = [{
		path: `a.txt`,
		content: {
			type: `string`,
			data: `---\ntitle: a\n---\ncontent`
		}
	}, {
		path: `b.md`,
		content: {
			type: `string`,
			data: `content---more`,
			excerpt: `content`
		},
		frontmatter: {
			title: `b`
		}
	}];
	
	// Test module.
	const frontmatter = Frontmatter(options);
	frontmatter.before();
	await frontmatter({}, files);
	// Compare files.
	t.deepEqual(files, filesOutcome);
});