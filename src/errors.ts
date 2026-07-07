import type { EndpointId } from "./types";

export interface ReinfolibValidationIssue {
	path: string;
	message: string;
	validation?: unknown;
}

export class ReinfolibValidationError extends Error {
	override readonly name = "ReinfolibValidationError";
	readonly endpoint: EndpointId;
	readonly issues: ReinfolibValidationIssue[];

	constructor(endpoint: EndpointId, issues: ReinfolibValidationIssue[]) {
		super(
			`Invalid ${endpoint} request: ${issues.map((issue) => `${issue.path} ${issue.message}`).join(", ")}`,
		);
		this.endpoint = endpoint;
		this.issues = issues;
	}
}

export interface ReinfolibApiErrorOptions {
	endpoint: EndpointId;
	status: number;
	statusText: string;
	url: string;
	responseText: string | undefined;
	cause?: unknown;
}

export class ReinfolibApiError extends Error {
	override readonly name = "ReinfolibApiError";
	readonly endpoint: EndpointId;
	readonly status: number;
	readonly statusText: string;
	readonly url: string;
	readonly responseText: string | undefined;

	constructor(options: ReinfolibApiErrorOptions) {
		super(
			`${options.endpoint} request failed with ${options.status} ${options.statusText}`,
			{
				cause: options.cause,
			},
		);
		this.endpoint = options.endpoint;
		this.status = options.status;
		this.statusText = options.statusText;
		this.url = options.url;
		this.responseText = options.responseText;
	}
}
