import { $fetch } from "ofetch";
import type { FetchOptions, FetchResponse } from "ofetch";
import { DEFAULT_BASE_URL, SUBSCRIPTION_KEY_HEADER } from "./constants";
import {
	endpoints,
	endpointAliases,
	endpointIds,
	type EndpointId,
} from "./endpoint-data";
import { ReinfolibApiError } from "./errors";
import { normalizeQuery, validateRequest } from "./schemas";
import type {
	EndpointRequest,
	EndpointResponse,
	JsonEndpointEnvelope,
	ReinfolibClient,
	ReinfolibRawClient,
	ReinfolibRequestOptions,
	ReinfolibUrlBuilder,
	ResponseFormat,
} from "./types";

export type ReinfolibFetchOptions = FetchOptions & {
	fetch?: typeof globalThis.fetch;
};

export interface CreateClientOptions {
	apiKey: string;
	baseURL?: string;
	timeout?: number;
	fetchOptions?: ReinfolibFetchOptions;
}

function normalizeBaseURL(baseURL: string): string {
	return baseURL.replace(/\/+$/, "");
}

function createHeaders(
	apiKey: string,
	headers: HeadersInit | undefined,
): Headers {
	const normalized = new Headers(headers);
	if (!normalized.has(SUBSCRIPTION_KEY_HEADER)) {
		normalized.set(SUBSCRIPTION_KEY_HEADER, apiKey);
	}
	return normalized;
}

function responseTextFromData(data: unknown): string | undefined {
	if (data === undefined) {
		return undefined;
	}
	if (typeof data === "string") {
		return data;
	}
	try {
		return JSON.stringify(data);
	} catch {
		return String(data);
	}
}

function wrapApiError(
	endpoint: EndpointId,
	url: string,
	error: unknown,
): never {
	const fetchError = error as {
		status?: number;
		statusCode?: number;
		statusText?: string;
		statusMessage?: string;
		response?: Response;
		data?: unknown;
	};
	const status =
		fetchError.status ??
		fetchError.statusCode ??
		fetchError.response?.status ??
		0;
	const statusText =
		fetchError.statusText ??
		fetchError.statusMessage ??
		fetchError.response?.statusText ??
		"Fetch Error";
	throw new ReinfolibApiError({
		endpoint,
		status,
		statusText,
		url: fetchError.response?.url || url,
		responseText: responseTextFromData(fetchError.data),
		cause: error,
	});
}

function responseTypeFor(params: unknown): "json" | "arrayBuffer" {
	const responseFormat = (params as { responseFormat?: ResponseFormat })
		.responseFormat;
	return responseFormat === "pbf" ? "arrayBuffer" : "json";
}

function isJsonEndpointEnvelope(
	value: unknown,
): value is JsonEndpointEnvelope<unknown> {
	return typeof value === "object" && value !== null && "data" in value;
}

function unwrapJsonEndpointResponse(
	endpoint: EndpointId,
	url: string,
	value: unknown,
): unknown {
	if (!isJsonEndpointEnvelope(value)) {
		return value;
	}

	if (typeof value.status === "string" && value.status.toLowerCase() !== "ok") {
		throw new ReinfolibApiError({
			endpoint,
			status: 200,
			statusText: `API status ${value.status}`,
			url,
			responseText: responseTextFromData(value),
			cause: value,
		});
	}

	return value.data;
}

function buildURL(
	baseURL: string,
	endpoint: EndpointId,
	params: EndpointRequest<EndpointId>,
): string {
	validateRequest(endpoint, params);
	const definition = endpoints[endpoint];
	let url: URL;
	try {
		url = new URL(`${baseURL}${definition.path}`);
	} catch (error) {
		throw new TypeError(`Invalid Reinfolib baseURL: ${baseURL}`, {
			cause: error,
		});
	}
	const query = normalizeQuery(endpoint, params);
	for (const [key, value] of Object.entries(query)) {
		url.searchParams.append(key, value);
	}
	return url.toString();
}

export function createClient(options: CreateClientOptions): ReinfolibClient {
	if (!options.apiKey) {
		throw new TypeError("createClient requires an apiKey");
	}

	const baseURL = normalizeBaseURL(options.baseURL ?? DEFAULT_BASE_URL);
	const { fetch: customFetch, ...fetchOptions } = options.fetchOptions ?? {};
	const fetcher = $fetch.create(
		{
			...fetchOptions,
			baseURL,
			timeout: options.timeout ?? fetchOptions.timeout ?? 30_000,
			retry: fetchOptions.retry ?? false,
			headers: createHeaders(options.apiKey, fetchOptions.headers),
		},
		customFetch ? { fetch: customFetch } : undefined,
	);

	async function request<T extends EndpointId>(
		endpoint: T,
		params: EndpointRequest<T>,
		requestOptions?: ReinfolibRequestOptions,
	): Promise<EndpointResponse<T>> {
		validateRequest(endpoint, params);
		const definition = endpoints[endpoint];
		const query = normalizeQuery(endpoint, params);
		const url = buildURL(
			baseURL,
			endpoint,
			params as EndpointRequest<EndpointId>,
		);
		try {
			const data = await fetcher(definition.path, {
				...requestOptions,
				query,
				responseType: responseTypeFor(params),
			});
			return (
				definition.kind === "json"
					? unwrapJsonEndpointResponse(endpoint, url, data)
					: data
			) as EndpointResponse<T>;
		} catch (error) {
			wrapApiError(endpoint, url, error);
		}
	}

	async function rawRequest<T extends EndpointId>(
		endpoint: T,
		params: EndpointRequest<T>,
		requestOptions?: ReinfolibRequestOptions,
	) {
		validateRequest(endpoint, params);
		const definition = endpoints[endpoint];
		const query = normalizeQuery(endpoint, params);
		const url = buildURL(
			baseURL,
			endpoint,
			params as EndpointRequest<EndpointId>,
		);
		try {
			return (await fetcher.raw(definition.path, {
				...requestOptions,
				query,
				responseType: responseTypeFor(params),
			})) as FetchResponse<EndpointResponse<T>>;
		} catch (error) {
			wrapApiError(endpoint, url, error);
		}
	}

	const client: Record<string, unknown> = { fetch: fetcher };
	const raw: Record<string, unknown> = {};
	const url: Record<string, unknown> = {};

	for (const endpoint of endpointIds) {
		const methodName = endpoints[endpoint].methodName;
		const method = (
			params: EndpointRequest<typeof endpoint>,
			requestOptions?: ReinfolibRequestOptions,
		) => request(endpoint, params, requestOptions);
		const rawMethod = (
			params: EndpointRequest<typeof endpoint>,
			requestOptions?: ReinfolibRequestOptions,
		) => rawRequest(endpoint, params, requestOptions);
		const urlMethod = (params: EndpointRequest<typeof endpoint>) =>
			buildURL(baseURL, endpoint, params as EndpointRequest<EndpointId>);
		client[methodName] = method;
		raw[methodName] = rawMethod;
		url[methodName] = urlMethod;
	}

	for (const [alias, endpoint] of Object.entries(endpointAliases) as Array<
		[keyof typeof endpointAliases, EndpointId]
	>) {
		const methodName = endpoints[endpoint].methodName;
		client[alias] = client[methodName];
		raw[alias] = raw[methodName];
		url[alias] = url[methodName];
	}

	client.raw = Object.freeze(raw) as unknown as ReinfolibRawClient;
	client.url = Object.freeze(url) as unknown as ReinfolibUrlBuilder;

	return Object.freeze(client) as unknown as ReinfolibClient;
}
