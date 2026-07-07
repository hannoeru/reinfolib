import type { StringNumber } from "./types";

export interface LonLatToTileInput {
	longitude: number;
	latitude: number;
	zoom: StringNumber;
}

export interface TileCoordinates {
	z: number;
	x: number;
	y: number;
}

function toInteger(value: StringNumber, name: string): number {
	const numberValue = typeof value === "number" ? value : Number(value);
	if (!Number.isInteger(numberValue)) {
		throw new TypeError(`${name} must be an integer`);
	}
	return numberValue;
}

export function lonLatToTile(
	longitude: number,
	latitude: number,
	zoom: StringNumber,
): TileCoordinates;
export function lonLatToTile(input: LonLatToTileInput): TileCoordinates;
export function lonLatToTile(
	longitudeOrInput: number | LonLatToTileInput,
	latitude?: number,
	zoom?: StringNumber,
): TileCoordinates {
	const input =
		typeof longitudeOrInput === "object"
			? longitudeOrInput
			: { longitude: longitudeOrInput, latitude, zoom };

	if (typeof input.latitude !== "number" || !Number.isFinite(input.latitude)) {
		throw new TypeError("latitude must be a finite number");
	}
	if (
		typeof input.longitude !== "number" ||
		!Number.isFinite(input.longitude)
	) {
		throw new TypeError("longitude must be a finite number");
	}
	if (input.latitude < -85.05112878 || input.latitude > 85.05112878) {
		throw new RangeError(
			"latitude must be between -85.05112878 and 85.05112878 for Web Mercator tiles",
		);
	}
	if (input.longitude < -180 || input.longitude > 180) {
		throw new RangeError("longitude must be between -180 and 180");
	}

	const z = toInteger(input.zoom as StringNumber, "zoom");
	const scale = 2 ** z;
	const x = Math.floor(((input.longitude + 180) / 360) * scale);
	const latRad = (input.latitude * Math.PI) / 180;
	const y = Math.floor(
		((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
			scale,
	);

	return {
		z,
		x: Math.min(Math.max(x, 0), scale - 1),
		y: Math.min(Math.max(y, 0), scale - 1),
	};
}
