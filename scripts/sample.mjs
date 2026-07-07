#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { createClient } from "../dist/index.js";

const apiKey = process.env.REINFOLIB_API_KEY;

if (!apiKey) {
	console.log(
		"Skipping live samples: set REINFOLIB_API_KEY to fetch sanitized fixtures.",
	);
	process.exit(0);
}

const client = createClient({
	apiKey,
	fetchOptions: {
		retry: false,
	},
});

const samples = [
	{
		endpoint: "XIT002",
		params: { area: "13" },
		run: async () => (await client.raw.xit002({ area: "13" }))._data,
	},
];

await mkdir("tests/fixtures", { recursive: true });

for (const sample of samples) {
	console.log(`Fetching ${sample.endpoint} sample...`);
	const data = await sample.run();
	const fixture = {
		endpoint: sample.endpoint,
		params: sample.params,
		fetchedAt: new Date().toISOString(),
		data,
	};
	await writeFile(
		`tests/fixtures/${sample.endpoint.toLowerCase()}.json`,
		`${JSON.stringify(fixture, null, 2)}\n`,
	);
}

console.log("Done. Review fixtures before committing.");
