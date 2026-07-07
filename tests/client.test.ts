import { readFile } from "node:fs/promises";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import {
	ReinfolibApiError,
	ReinfolibValidationError,
	createClient,
	endpointIds,
	endpoints,
	getPrefectureName,
	lonLatToTile,
	type XIT001Response,
	type XPT001GeoJsonResponse,
} from "../src/index";

function validParamsFor(
	endpoint: keyof typeof endpoints,
	responseFormat: "geojson" | "pbf" = "geojson",
) {
	const definition = endpoints[endpoint];
	const params: Record<string, unknown> = {};

	for (const param of definition.params) {
		if (!param.required) {
			continue;
		}

		switch (param.inputName) {
			case "responseFormat":
				params.responseFormat = responseFormat;
				break;
			case "z": {
				const minZoom =
					"minZoom" in definition ? definition.minZoom : undefined;
				params.z = minZoom ?? 14;
				break;
			}
			case "x":
				params.x = 1;
				break;
			case "y":
				params.y = 1;
				break;
			case "year":
				params.year = 2024;
				break;
			case "area":
				params.area = "13";
				break;
			case "division":
				params.division = "00";
				break;
			case "from":
				params.from = 20252;
				break;
			case "to":
				params.to = 20252;
				break;
		}
	}

	if (endpoint === "XIT001") {
		params.city = "13102";
	}

	return params;
}

function callEndpoint(
	client: unknown,
	methodName: string,
	params: Record<string, unknown>,
) {
	const method = (
		client as Record<
			string,
			((input: Record<string, unknown>) => Promise<unknown>) | undefined
		>
	)[methodName];
	if (!method) {
		throw new Error(`Missing client method: ${methodName}`);
	}
	return method(params);
}

describe("createClient", () => {
	it("builds credential-free URLs in documented query order", () => {
		const client = createClient({ apiKey: "secret" });

		expect(
			client.url.xit001({ year: 2015, quarter: 2, area: ["09", "10"] }),
		).toBe(
			"https://www.reinfolib.mlit.go.jp/ex-api/external/XIT001?year=2015&quarter=2&area=09%2C10",
		);
	});

	it("supports longitude/latitude overloads for tile endpoints", () => {
		const client = createClient({
			apiKey: "secret",
			baseURL: "https://example.test/api/",
		});
		const tile = lonLatToTile({
			longitude: 139.767,
			latitude: 35.681,
			zoom: 14,
		});

		expect(
			client.url.xkt001({
				responseFormat: "geojson",
				longitude: 139.767,
				latitude: 35.681,
				zoom: 14,
			}),
		).toBe(
			`https://example.test/api/XKT001?response_format=geojson&z=${tile.z}&x=${tile.x}&y=${tile.y}`,
		);
	});

	it("validates requests before network calls", async () => {
		const fetch = vi.fn<typeof globalThis.fetch>();
		const client = createClient({ apiKey: "secret", fetchOptions: { fetch } });

		await expect(client.xit001({ year: 2024 } as never)).rejects.toBeInstanceOf(
			ReinfolibValidationError,
		);
		await expect(
			client.xkt001({ responseFormat: "geojson", z: 10, x: 1, y: 1 }),
		).rejects.toBeInstanceOf(ReinfolibValidationError);
		expect(fetch).not.toHaveBeenCalled();
	});

	it("calls ofetch with subscription key headers", async () => {
		const fetch = vi.fn<typeof globalThis.fetch>(async (request, init) => {
			const headers = new Headers(
				request instanceof Request ? request.headers : init?.headers,
			);
			expect(headers.get("Ocp-Apim-Subscription-Key")).toBe("secret");
			return Response.json({
				status: "OK",
				data: [{ id: "13101", name: "千代田区" }],
			});
		});
		const client = createClient({ apiKey: "secret", fetchOptions: { fetch } });

		await expect(client.xit002({ area: "13" })).resolves.toEqual([
			{ id: "13101", name: "千代田区" },
		]);
		expect(fetch).toHaveBeenCalledOnce();
	});

	it("returns raw ofetch responses", async () => {
		const fetch = vi.fn<typeof globalThis.fetch>(async () =>
			Response.json(
				{ status: "OK", data: [{ id: "13101", name: "千代田区" }] },
				{ status: 200 },
			),
		);
		const client = createClient({ apiKey: "secret", fetchOptions: { fetch } });

		const response = await client.raw.xit002({ area: "13" });
		expect(response.status).toBe(200);
		expect(response._data).toEqual({
			status: "OK",
			data: [{ id: "13101", name: "千代田区" }],
		});
	});

	it("returns ArrayBuffer for pbf tile requests", async () => {
		const bytes = new Uint8Array([1, 2, 3]);
		const fetch = vi.fn<typeof globalThis.fetch>(
			async () => new Response(bytes),
		);
		const client = createClient({ apiKey: "secret", fetchOptions: { fetch } });

		const response = await client.xpt001({
			responseFormat: "pbf",
			z: 14,
			x: 14624,
			y: 6016,
			from: 20252,
			to: 20252,
		});
		expect(response).toBeInstanceOf(ArrayBuffer);
		expect(Array.from(new Uint8Array(response))).toEqual([1, 2, 3]);
	});

	it("throws when an API envelope status is not OK", async () => {
		const fetch = vi.fn<typeof globalThis.fetch>(async () =>
			Response.json({ status: "ERROR", data: [] }, { status: 200 }),
		);
		const client = createClient({ apiKey: "secret", fetchOptions: { fetch } });

		await expect(client.xit002({ area: "13" })).rejects.toMatchObject({
			constructor: ReinfolibApiError,
			status: 200,
			statusText: "API status ERROR",
			endpoint: "XIT002",
		});
	});

	it("wraps ofetch errors", async () => {
		const fetch = vi.fn<typeof globalThis.fetch>(async () =>
			Response.json(
				{ message: "bad key" },
				{ status: 401, statusText: "Access Denied" },
			),
		);
		const client = createClient({ apiKey: "secret", fetchOptions: { fetch } });

		await expect(client.xit002({ area: "13" })).rejects.toMatchObject({
			constructor: ReinfolibApiError,
			status: 401,
			endpoint: "XIT002",
		});
	});
});

describe("endpoint kinds", () => {
	const jsonEndpointIds = endpointIds.filter(
		(endpoint) => endpoints[endpoint].kind === "json",
	);
	const tileEndpointIds = endpointIds.filter(
		(endpoint) => endpoints[endpoint].kind === "tile",
	);

	it.each(
		jsonEndpointIds,
	)("%s unwraps JSON response envelopes", async (endpoint) => {
		const definition = endpoints[endpoint];
		const fetch = vi.fn<typeof globalThis.fetch>(async () =>
			Response.json({ status: "OK", data: [{ endpoint }] }),
		);
		const client = createClient({ apiKey: "secret", fetchOptions: { fetch } });

		await expect(
			callEndpoint(client, definition.methodName, validParamsFor(endpoint)),
		).resolves.toEqual([{ endpoint }]);
	});

	it.each(
		tileEndpointIds,
	)("%s returns GeoJSON tile payloads", async (endpoint) => {
		const definition = endpoints[endpoint];
		const featureCollection = {
			type: "FeatureCollection",
			features: [],
		};
		const fetch = vi.fn<typeof globalThis.fetch>(async () =>
			Response.json(featureCollection),
		);
		const client = createClient({ apiKey: "secret", fetchOptions: { fetch } });

		await expect(
			callEndpoint(
				client,
				definition.methodName,
				validParamsFor(endpoint, "geojson"),
			),
		).resolves.toEqual(featureCollection);
	});

	it.each(
		tileEndpointIds,
	)("%s returns PBF tile payloads as ArrayBuffer", async (endpoint) => {
		const definition = endpoints[endpoint];
		const bytes = new Uint8Array([1, 2, 3]);
		const fetch = vi.fn<typeof globalThis.fetch>(
			async () => new Response(bytes),
		);
		const client = createClient({ apiKey: "secret", fetchOptions: { fetch } });

		const response = await callEndpoint(
			client,
			definition.methodName,
			validParamsFor(endpoint, "pbf"),
		);
		expect(response).toBeInstanceOf(ArrayBuffer);
		expect(Array.from(new Uint8Array(response as ArrayBuffer))).toEqual([
			1, 2, 3,
		]);
	});
});

describe("fixtures", () => {
	it("matches the live XIT002 wrapper shape", async () => {
		const fixtureText = await readFile("tests/fixtures/xit002.json", "utf8");
		let fixture: unknown;
		try {
			fixture = JSON.parse(fixtureText) as unknown;
		} catch (error) {
			throw new Error("Invalid tests/fixtures/xit002.json", { cause: error });
		}
		expect(fixture).toMatchObject({
			endpoint: "XIT002",
			data: {
				status: "OK",
				data: expect.arrayContaining([
					expect.objectContaining({ id: "13101", name: "千代田区" }),
				]),
			},
		});
	});
});

describe("exports", () => {
	it("exports endpoint metadata and prefecture helpers", () => {
		expect(endpoints.XIT001.manualUrl).toBe(
			"https://www.reinfolib.mlit.go.jp/help/apiManual/xit001/",
		);
		expect(getPrefectureName("13", "en")).toBe("Tokyo");
	});

	it("exposes useful compile-time types", () => {
		const client = createClient({ apiKey: "secret" });

		expectTypeOf(client.xit001({ year: 2024, city: "13102" })).toEqualTypeOf<
			Promise<XIT001Response>
		>();
		expectTypeOf(
			client.xpt001({
				responseFormat: "geojson",
				z: 14,
				x: 14624,
				y: 6016,
				from: 20252,
				to: 20252,
			}),
		).toEqualTypeOf<Promise<XPT001GeoJsonResponse>>();
		expectTypeOf(
			client.xpt001({
				responseFormat: "pbf",
				z: 14,
				x: 14624,
				y: 6016,
				from: 20252,
				to: 20252,
			}),
		).toEqualTypeOf<Promise<ArrayBuffer>>();
	});
});
