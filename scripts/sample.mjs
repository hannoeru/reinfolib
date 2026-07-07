#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { createClient, endpoints } from "../dist/index.js";

const apiKey = process.env.REINFOLIB_API_KEY;
const delayMs = Number(process.env.REINFOLIB_SAMPLE_DELAY_MS ?? 500);
const maxItems = Number(process.env.REINFOLIB_SAMPLE_MAX_ITEMS ?? 5);

function log(message) {
	process.stdout.write(`${message}\n`);
}

function warn(message) {
	process.stderr.write(`${message}\n`);
}

if (!apiKey) {
	log(
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

const sampleCoordinates = {
	// Tokyo Station. Tile endpoints can still return empty collections depending on layer coverage.
	longitude: 139.767,
	latitude: 35.681,
};

const sampleValuesByKind = {
	administrativeAreaCode: "13101",
	appraisalDivisionCode: "00",
	cityCode: "13102",
	landPriceClassification: "0",
	landTypeCode: "01",
	language: "ja",
	prefectureCode: "13",
	priceClassification: "01",
	quarter: 1,
	responseFormat: "geojson",
	stationCode: "000000",
	year: 2024,
	yearQuarter: 20241,
};

function sampleValueForParam(param) {
	if (param.inputName in sampleValuesByKind) {
		return sampleValuesByKind[param.inputName];
	}
	if (param.kind in sampleValuesByKind) {
		return sampleValuesByKind[param.kind];
	}
	return "sample";
}

function clampZoom(definition, preferredZoom = 14) {
	return Math.min(
		Math.max(preferredZoom, definition.minZoom ?? preferredZoom),
		definition.maxZoom ?? preferredZoom,
	);
}

function hasAnyRequireOneOfValue(definition, params) {
	return (
		definition.requireOneOf?.some((key) => params[key] !== undefined) ?? true
	);
}

function addRequireOneOfValue(definition, params) {
	if (
		!definition.requireOneOf?.length ||
		hasAnyRequireOneOfValue(definition, params)
	) {
		return;
	}

	const preferredKey = definition.requireOneOf.includes("city")
		? "city"
		: definition.requireOneOf[0];
	const param = definition.params.find(
		({ inputName }) => inputName === preferredKey,
	);
	params[preferredKey] = param ? sampleValueForParam(param) : "sample";
}

function sampleParamsFor(definition) {
	const params = {};

	for (const param of definition.params) {
		if (!param.required) {
			continue;
		}
		if (["z", "x", "y"].includes(param.inputName)) {
			continue;
		}
		params[param.inputName] = sampleValueForParam(param);
	}

	if (definition.kind === "tile") {
		params.responseFormat = "geojson";
		params.zoom = clampZoom(definition);
		params.longitude = sampleCoordinates.longitude;
		params.latitude = sampleCoordinates.latitude;
	}

	if (definition.id === "XIT001") {
		params.year = 2024;
		params.quarter = 1;
		params.city = "13102";
		params.priceClassification = "01";
	}

	if (definition.id === "XCT001") {
		params.year = 2024;
		params.area = "13";
		params.division = "00";
	}

	addRequireOneOfValue(definition, params);
	return params;
}

function trimResponseData(data) {
	if (Array.isArray(data)) {
		return {
			data: data.slice(0, maxItems),
			truncated: data.length > maxItems,
			originalItemCount: data.length,
		};
	}

	if (data && typeof data === "object") {
		if (Array.isArray(data.data)) {
			return {
				data: {
					...data,
					data: data.data.slice(0, maxItems),
				},
				truncated: data.data.length > maxItems,
				originalItemCount: data.data.length,
			};
		}

		if (Array.isArray(data.features)) {
			return {
				data: {
					...data,
					features: data.features.slice(0, maxItems),
				},
				truncated: data.features.length > maxItems,
				originalItemCount: data.features.length,
			};
		}
	}

	return { data, truncated: false };
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

await mkdir("tests/fixtures", { recursive: true });

const failures = [];

for (const definition of Object.values(endpoints)) {
	const params = sampleParamsFor(definition);
	const method = client.raw[definition.methodName];

	log(`Fetching ${definition.id} sample...`);

	try {
		const response = await method(params);
		const trimmed = trimResponseData(response._data);
		const fixture = {
			endpoint: definition.id,
			methodName: definition.methodName,
			alias: definition.alias,
			kind: definition.kind,
			params,
			fetchedAt: new Date().toISOString(),
			truncated: trimmed.truncated,
			originalItemCount: trimmed.originalItemCount,
			data: trimmed.data,
		};

		await writeFile(
			`tests/fixtures/${definition.id.toLowerCase()}.json`,
			`${JSON.stringify(fixture, null, 2)}\n`,
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		failures.push({ endpoint: definition.id, message });
		warn(`Failed ${definition.id}: ${message}`);
	}

	if (delayMs > 0) {
		await sleep(delayMs);
	}
}

if (failures.length) {
	warn("Done with failures. Review generated fixtures before committing.");
	warn(JSON.stringify(failures, null, 2));
	process.exitCode = 1;
} else {
	log("Done. Review fixtures before committing.");
}
