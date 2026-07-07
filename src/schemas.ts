import * as v from "valibot";
import { endpoints, type EndpointId } from "./endpoint-data";
import { PREFECTURES } from "./constants";
import {
	ReinfolibValidationError,
	type ReinfolibValidationIssue,
} from "./errors";
import { lonLatToTile } from "./tile";
import type {
	EndpointDefinition,
	EndpointRequest,
	StringNumber,
} from "./types";

const prefectureCodes = new Set<string>(
	PREFECTURES.map((prefecture) => prefecture.code),
);

const objectSchema = v.custom<Record<string, unknown>>(
	(input) =>
		typeof input === "object" && input !== null && !Array.isArray(input),
	"Expected an object",
);
const stringNumberSchema = v.union([v.string(), v.number()]);
const finiteNumberSchema = v.pipe(
	v.number(),
	v.check(
		(input: number) => Number.isFinite(input),
		"Expected a finite number",
	),
);
const responseFormatSchema = v.picklist(["geojson", "pbf"]);
const languageSchema = v.picklist(["ja", "en"]);
const quarterSchema = v.union([
	v.picklist(["1", "2", "3", "4"]),
	v.picklist([1, 2, 3, 4]),
]);
const priceClassificationSchema = v.picklist(["01", "02"]);
const landPriceClassificationSchema = v.union([
	v.picklist(["0", "1"]),
	v.picklist([0, 1]),
]);
const landTypeCodeSchema = v.picklist(["01", "02", "07", "10", "11"]);
const appraisalDivisionCodeSchema = v.picklist([
	"00",
	"03",
	"05",
	"07",
	"09",
	"10",
	"13",
	"20",
]);
const prefectureCodeSchema = v.custom<string>(
	(input) => typeof input === "string" && prefectureCodes.has(input),
	"Expected a prefecture code from 01 to 47",
);
const yearSchema = v.pipe(
	stringNumberSchema,
	v.check((input) => /^\d{4}$/.test(String(input)), "Expected YYYY"),
);
const yearQuarterSchema = v.pipe(
	stringNumberSchema,
	v.check((input) => /^\d{5}$/.test(String(input)), "Expected YYYYN"),
);
const cityCodeSchema = v.pipe(
	v.string(),
	v.regex(/^\d{5}$/, "Expected a 5-digit city code"),
);
const stationCodeSchema = v.pipe(
	v.string(),
	v.regex(/^\d{6}$/, "Expected a 6-digit station code"),
);
const administrativeAreaCodeSchema = v.pipe(
	v.string(),
	v.regex(/^\d{5}$/, "Expected a 5-digit administrative area code"),
);
const stringCodeSchema = v.pipe(
	v.string(),
	v.check((input) => input.length > 0, "Expected a non-empty string"),
);
const tileIntegerSchema = v.pipe(
	stringNumberSchema,
	v.check((input) => Number.isInteger(Number(input)), "Expected an integer"),
);

function schemaForKind(
	kind: string,
): v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>> {
	switch (kind) {
		case "responseFormat":
			return responseFormatSchema;
		case "language":
			return languageSchema;
		case "quarter":
			return quarterSchema;
		case "priceClassification":
			return priceClassificationSchema;
		case "landPriceClassification":
			return landPriceClassificationSchema;
		case "landTypeCode":
			return landTypeCodeSchema;
		case "appraisalDivisionCode":
			return appraisalDivisionCodeSchema;
		case "prefectureCode":
			return prefectureCodeSchema;
		case "year":
			return yearSchema;
		case "yearQuarter":
			return yearQuarterSchema;
		case "cityCode":
			return cityCodeSchema;
		case "stationCode":
			return stationCodeSchema;
		case "administrativeAreaCode":
			return administrativeAreaCodeSchema;
		case "tileInteger":
			return tileIntegerSchema;
		case "number":
			return finiteNumberSchema;
		default:
			return stringCodeSchema;
	}
}

function asIssue(
	path: string,
	message: string,
	validation?: unknown,
): ReinfolibValidationIssue {
	return { path, message, validation };
}

function validateValue(
	path: string,
	value: unknown,
	kind: string,
): ReinfolibValidationIssue[] {
	const result = v.safeParse(schemaForKind(kind), value);
	if (result.success) {
		return [];
	}
	return result.issues.map((issue) => asIssue(path, issue.message, issue));
}

function validateMaybeArray(
	path: string,
	value: unknown,
	kind: string,
	multiple: boolean,
): ReinfolibValidationIssue[] {
	if (value === null) {
		return [asIssue(path, "must not be null")];
	}
	if (!multiple) {
		return validateValue(path, value, kind);
	}
	const values = Array.isArray(value) ? value : [value];
	if (values.length === 0) {
		return [asIssue(path, "must not be an empty array")];
	}
	return values.flatMap((item, index) =>
		validateValue(`${path}[${index}]`, item, kind),
	);
}

function normalizeTileInput(
	definition: EndpointDefinition,
	record: Record<string, unknown>,
): { z: StringNumber; x: StringNumber; y: StringNumber } | undefined {
	if (definition.kind !== "tile") {
		return undefined;
	}

	const hasXYZ =
		record.z !== undefined || record.x !== undefined || record.y !== undefined;
	const hasLonLat =
		record.zoom !== undefined ||
		record.longitude !== undefined ||
		record.latitude !== undefined;

	if (hasXYZ && hasLonLat) {
		return undefined;
	}
	if (hasLonLat) {
		return lonLatToTile({
			zoom: record.zoom as StringNumber,
			longitude: record.longitude as number,
			latitude: record.latitude as number,
		});
	}
	return {
		z: record.z as StringNumber,
		x: record.x as StringNumber,
		y: record.y as StringNumber,
	};
}

export function validateRequest<T extends EndpointId>(
	endpoint: T,
	params: unknown,
): EndpointRequest<T> {
	const definition = endpoints[endpoint] as EndpointDefinition;
	const objectResult = v.safeParse(objectSchema, params);
	if (!objectResult.success) {
		throw new ReinfolibValidationError(
			endpoint,
			objectResult.issues.map((issue) =>
				asIssue("params", issue.message, issue),
			),
		);
	}

	const record = objectResult.output;
	const issues: ReinfolibValidationIssue[] = [];
	const allowedKeys = new Set<string>(
		definition.params.map((param) => param.inputName),
	);
	if (definition.kind === "tile") {
		allowedKeys.add("zoom");
		allowedKeys.add("longitude");
		allowedKeys.add("latitude");
	}

	for (const key of Object.keys(record)) {
		if (!allowedKeys.has(key)) {
			issues.push(asIssue(key, "is not a supported parameter"));
		}
	}

	let normalizedTile:
		| { z: StringNumber; x: StringNumber; y: StringNumber }
		| undefined;
	try {
		normalizedTile = normalizeTileInput(definition, record);
	} catch (error) {
		issues.push(
			asIssue(
				"tile",
				error instanceof Error ? error.message : "invalid tile coordinates",
				error,
			),
		);
	}

	if (definition.kind === "tile") {
		const hasXYZ =
			record.z !== undefined ||
			record.x !== undefined ||
			record.y !== undefined;
		const hasLonLat =
			record.zoom !== undefined ||
			record.longitude !== undefined ||
			record.latitude !== undefined;
		if (hasXYZ && hasLonLat) {
			issues.push(
				asIssue(
					"tile",
					"use either z/x/y or zoom/longitude/latitude, not both",
				),
			);
		}
		if (!hasXYZ && !hasLonLat) {
			issues.push(
				asIssue("tile", "requires either z/x/y or zoom/longitude/latitude"),
			);
		}
		if (hasLonLat) {
			issues.push(...validateValue("zoom", record.zoom, "tileInteger"));
			issues.push(...validateValue("longitude", record.longitude, "number"));
			issues.push(...validateValue("latitude", record.latitude, "number"));
		}
	}

	for (const param of definition.params) {
		const value =
			param.inputName === "z" ||
			param.inputName === "x" ||
			param.inputName === "y"
				? normalizedTile?.[param.inputName]
				: record[param.inputName];

		if (value === undefined) {
			if (param.required) {
				issues.push(asIssue(param.inputName, "is required"));
			}
			continue;
		}
		issues.push(
			...validateMaybeArray(param.inputName, value, param.kind, param.multiple),
		);
	}

	if (definition.requireOneOf?.length) {
		const hasOne = definition.requireOneOf.some(
			(key) => record[key] !== undefined,
		);
		if (!hasOne) {
			issues.push(
				asIssue(
					definition.requireOneOf.join("|"),
					"at least one of these parameters is required",
				),
			);
		}
	}

	if (normalizedTile?.z !== undefined && definition.minZoom !== undefined) {
		const z = Number(normalizedTile.z);
		if (Number.isInteger(z) && z < definition.minZoom) {
			issues.push(asIssue("z", `must be >= ${definition.minZoom}`));
		}
	}
	if (normalizedTile?.z !== undefined && definition.maxZoom !== undefined) {
		const z = Number(normalizedTile.z);
		if (Number.isInteger(z) && z > definition.maxZoom) {
			issues.push(asIssue("z", `must be <= ${definition.maxZoom}`));
		}
	}

	if (issues.length) {
		throw new ReinfolibValidationError(endpoint, issues);
	}

	return record as EndpointRequest<T>;
}

export function normalizeQuery<T extends EndpointId>(
	endpoint: T,
	params: EndpointRequest<T>,
): Record<string, string> {
	const definition = endpoints[endpoint] as EndpointDefinition;
	const record = params as Record<string, unknown>;
	const normalizedTile = normalizeTileInput(definition, record);
	const query: Record<string, string> = {};

	for (const param of definition.params) {
		const value =
			param.inputName === "z" ||
			param.inputName === "x" ||
			param.inputName === "y"
				? normalizedTile?.[param.inputName]
				: record[param.inputName];
		if (value === undefined) {
			continue;
		}
		query[param.name] = Array.isArray(value)
			? value.map(String).join(",")
			: String(value);
	}

	return query;
}

function createEndpointRequestSchema<T extends EndpointId>(endpoint: T) {
	return v.custom<EndpointRequest<T>>((input) => {
		try {
			validateRequest(endpoint, input);
			return true;
		} catch {
			return false;
		}
	}, `Invalid ${endpoint} request`);
}

export const xit001RequestSchema = createEndpointRequestSchema("XIT001");
export const xit002RequestSchema = createEndpointRequestSchema("XIT002");
export const xct001RequestSchema = createEndpointRequestSchema("XCT001");
export const xpt001RequestSchema = createEndpointRequestSchema("XPT001");
export const xpt002RequestSchema = createEndpointRequestSchema("XPT002");
export const xkt001RequestSchema = createEndpointRequestSchema("XKT001");
export const xkt002RequestSchema = createEndpointRequestSchema("XKT002");
export const xkt003RequestSchema = createEndpointRequestSchema("XKT003");
export const xkt004RequestSchema = createEndpointRequestSchema("XKT004");
export const xkt005RequestSchema = createEndpointRequestSchema("XKT005");
export const xkt006RequestSchema = createEndpointRequestSchema("XKT006");
export const xkt007RequestSchema = createEndpointRequestSchema("XKT007");
export const xkt010RequestSchema = createEndpointRequestSchema("XKT010");
export const xkt011RequestSchema = createEndpointRequestSchema("XKT011");
export const xkt013RequestSchema = createEndpointRequestSchema("XKT013");
export const xkt014RequestSchema = createEndpointRequestSchema("XKT014");
export const xkt015RequestSchema = createEndpointRequestSchema("XKT015");
export const xkt016RequestSchema = createEndpointRequestSchema("XKT016");
export const xkt017RequestSchema = createEndpointRequestSchema("XKT017");
export const xkt018RequestSchema = createEndpointRequestSchema("XKT018");
export const xkt019RequestSchema = createEndpointRequestSchema("XKT019");
export const xkt020RequestSchema = createEndpointRequestSchema("XKT020");
export const xkt021RequestSchema = createEndpointRequestSchema("XKT021");
export const xkt022RequestSchema = createEndpointRequestSchema("XKT022");
export const xkt023RequestSchema = createEndpointRequestSchema("XKT023");
export const xkt024RequestSchema = createEndpointRequestSchema("XKT024");
export const xkt025RequestSchema = createEndpointRequestSchema("XKT025");
export const xkt026RequestSchema = createEndpointRequestSchema("XKT026");
export const xkt027RequestSchema = createEndpointRequestSchema("XKT027");
export const xkt028RequestSchema = createEndpointRequestSchema("XKT028");
export const xkt029RequestSchema = createEndpointRequestSchema("XKT029");
export const xkt030RequestSchema = createEndpointRequestSchema("XKT030");
export const xkt031RequestSchema = createEndpointRequestSchema("XKT031");
export const xgt001RequestSchema = createEndpointRequestSchema("XGT001");
export const xst001RequestSchema = createEndpointRequestSchema("XST001");

export const requestSchemas = {
	XIT001: xit001RequestSchema,
	XIT002: xit002RequestSchema,
	XCT001: xct001RequestSchema,
	XPT001: xpt001RequestSchema,
	XPT002: xpt002RequestSchema,
	XKT001: xkt001RequestSchema,
	XKT002: xkt002RequestSchema,
	XKT003: xkt003RequestSchema,
	XKT004: xkt004RequestSchema,
	XKT005: xkt005RequestSchema,
	XKT006: xkt006RequestSchema,
	XKT007: xkt007RequestSchema,
	XKT010: xkt010RequestSchema,
	XKT011: xkt011RequestSchema,
	XKT013: xkt013RequestSchema,
	XKT014: xkt014RequestSchema,
	XKT015: xkt015RequestSchema,
	XKT016: xkt016RequestSchema,
	XKT017: xkt017RequestSchema,
	XKT018: xkt018RequestSchema,
	XKT019: xkt019RequestSchema,
	XKT020: xkt020RequestSchema,
	XKT021: xkt021RequestSchema,
	XKT022: xkt022RequestSchema,
	XKT023: xkt023RequestSchema,
	XKT024: xkt024RequestSchema,
	XKT025: xkt025RequestSchema,
	XKT026: xkt026RequestSchema,
	XKT027: xkt027RequestSchema,
	XKT028: xkt028RequestSchema,
	XKT029: xkt029RequestSchema,
	XKT030: xkt030RequestSchema,
	XKT031: xkt031RequestSchema,
	XGT001: xgt001RequestSchema,
	XST001: xst001RequestSchema,
} as const;
