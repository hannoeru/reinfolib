# reinfolib

Unofficial TypeScript client for Japan MLIT [Real Estate Information Library](https://www.reinfolib.mlit.go.jp/) (不動産情報ライブラリ) API.

This package is not affiliated with, endorsed by, or sponsored by Japan MLIT. Users must comply with [MLIT terms of use](https://www.reinfolib.mlit.go.jp/help/termsOfUse/) and obtain their own API key. See [Get an API key](#get-an-api-key) below.

> MLIT documents recommend not sending API requests directly from browsers because of CORS. Use this client from Node.js, server-side rendering, edge/server runtimes, or your own backend/proxy.

## Install

```bash
pnpm add reinfolib
```

## Get an API key

Every request requires an MLIT API key. MLIT issues keys per applicant after a short review.

1. Read the [API terms of use](https://www.reinfolib.mlit.go.jp/help/termsOfUse/).
2. Open the [API application page](https://www.reinfolib.mlit.go.jp/api/request/) and fill in the requester information. Pick the applicant type that matches you (`個人` for personal use, `法人` for organizations with a corporate number, or `法人以外の団体` otherwise). You only need to apply for API access — the web UI does not require a key.
3. Submit and wait for the review result. MLIT notifies approved applicants by email, typically within **5 business days**.
4. Once approved, you receive an API key by email. Set it as an environment variable and pass it to the client. reinfolib sends it on every request as the `Ocp-Apim-Subscription-Key` header automatically.

```bash
# .env (do not commit)
REINFOLIB_API_KEY=your-issued-api-key
```

```ts
import { createClient } from "reinfolib"

const client = createClient({
  apiKey: process.env.REINFOLIB_API_KEY!,
})
```

> **Keep the key server-side.** MLIT recommends not calling the API directly from browsers (CORS), so use this client from Node.js, an edge/server runtime, or your own backend/proxy. Never expose the key in client bundles.

If you already have a key and want to change or stop using it, contact MLIT via the [contact form](https://www.reinfolib.mlit.go.jp/help/contact/) (select an API-related topic).

## Quick start

```ts
import { createClient } from "reinfolib"

const client = createClient({
  apiKey: process.env.REINFOLIB_API_KEY!,
})

const municipalities = await client.xit002({ area: "13" })
// friendly alias for the same endpoint
const same = await client.getMunicipalities({ area: "13" })
```

## Features

- Fully typed endpoint methods for every API listed in the public manual.
- Official ID methods (`xit001`) plus friendly aliases (`getRealEstatePrices`).
- `ofetch` internally, including `$fetch.raw`-style raw responses.
- Non-tile JSON methods unwrap MLIT `{ status: "OK", data }` envelopes and return `data` directly.
- Valibot request validation before network calls.
- GeoJSON/PBF tile endpoints with conditional return types.
- Coordinate overloads for tile endpoints: pass either `z/x/y` or `zoom/longitude/latitude`.
- Public endpoint metadata, request schemas, prefecture constants, and URL builders.

## Examples

### Non-tile JSON endpoint

```ts
const prices = await client.xit001({
  year: 2024,
  quarter: 1,
  city: "13102",
  priceClassification: "01",
})
```

### GeoJSON tile endpoint

```ts
const geojson = await client.xpt001({
  responseFormat: "geojson",
  z: 14,
  x: 14624,
  y: 6016,
  from: 20252,
  to: 20252,
})
```

### Coordinate overload

```ts
const useDistricts = await client.getUseDistricts({
  responseFormat: "geojson",
  zoom: 14,
  longitude: 139.767,
  latitude: 35.681,
})
```

### PBF tile endpoint

```ts
const pbf = await client.xkt001({
  responseFormat: "pbf",
  z: 14,
  x: 14626,
  y: 6020,
})
// ArrayBuffer
```

### Raw response and URL builder

```ts
const response = await client.raw.xit002({ area: "13" })
// Raw methods keep the MLIT envelope on _data: { status: "OK", data: [...] }
console.log(response.status, response.headers, response._data)

const url = client.url.xit002({ area: "13" })
// No API key is included in generated URLs.
```

### Configure ofetch

```ts
const client = createClient({
  apiKey: process.env.REINFOLIB_API_KEY!,
  timeout: 30_000,
  fetchOptions: {
    retry: false,
    onRequest({ request }) {
      console.debug("reinfolib", request)
    },
  },
})
```

## Helper utilities

reinfolib exports the building blocks it uses internally so you can validate input, build URLs, inspect endpoint metadata, and work with prefecture codes and tile coordinates without making a request.

### Validate and normalize requests

`validateRequest(endpoint, params)` runs the same Valibot validation the client uses and returns the normalized params, or throws `ReinfolibValidationError`. Use it to check input before queuing work or to fail fast in tests.

```ts
import { validateRequest, ReinfolibValidationError } from "reinfolib"

try {
  const params = validateRequest("XIT001", {
    year: 2024,
    quarter: 1,
    area: "13",
  })
} catch (error) {
  if (error instanceof ReinfolibValidationError) {
    console.error(error.endpoint, error.issues)
  }
}
```

`normalizeQuery(endpoint, params)` converts validated params into the query string MLIT expects (arrays become comma-separated strings; tile coordinates resolve to `z`/`x`/`y`). Pair it with `validateRequest` when you build URLs yourself.

```ts
import { validateRequest, normalizeQuery } from "reinfolib"

const params = validateRequest("XIT002", { area: "13" })
const query = normalizeQuery("XIT002", params)
// { area: "13" }
```

Each endpoint also has a ready-made Valibot schema (`xit001RequestSchema`, `xkt002RequestSchema`, …) and a `requestSchemas` map keyed by endpoint ID, useful for form validation or composing with your own schemas.

```ts
import { requestSchemas } from "reinfolib"
// requestSchemas.XIT001, requestSchemas.XKT002, ...
```

### Convert coordinates to tile coordinates

`lonLatToTile(longitude, latitude, zoom)` converts a WGS84 lon/lat to Web Mercator `{ z, x, y }` tile coordinates. Call it directly, or pass `zoom`/`longitude`/`latitude` to any tile endpoint and the client calls it for you.

```ts
import { lonLatToTile } from "reinfolib"

const { z, x, y } = lonLatToTile(139.767, 35.681, 14)
// { z: 14, x: 14552, y: 6451 }
```

It throws `TypeError`/`RangeError` for non-finite values, out-of-range coordinates, or non-integer zoom levels.

### Prefecture codes and names

`PREFECTURES` is the full list of Japan's 47 prefectures with `code`, `nameJa`, and `nameEn`. `getPrefectureName(code, language?)` looks up a display name from a `PrefectureCode` (`"01"`–`"47"`).

```ts
import { PREFECTURES, getPrefectureName } from "reinfolib"

getPrefectureName("13")            // "東京都"
getPrefectureName("13", "en")      // "Tokyo"
PREFECTURES.length                  // 47
```

### Endpoint metadata

`endpoints` is the full endpoint registry (ID, method/alias names, path, manual URL, category, kind, params, and response fields). `endpointAliases` maps the friendly alias (`getRealEstatePrices`) to its endpoint ID, and `endpointIds` lists every ID.

```ts
import { endpoints, endpointAliases, endpointIds } from "reinfolib"

endpoints.XKT002.manualUrl          // https://www.reinfolib.mlit.go.jp/help/apiManual/xkt002/
endpointAliases.getUseDistricts     // "XKT002"
endpointIds                         // ["XIT001", "XIT002", ...]
```

### Constants and errors

`DEFAULT_BASE_URL` is the MLIT API base (`https://www.reinfolib.mlit.go.jp/ex-api/external`) and `SUBSCRIPTION_KEY_HEADER` is the header name (`Ocp-Apim-Subscription-Key`) the client sets from `apiKey`.

```ts
import { DEFAULT_BASE_URL, SUBSCRIPTION_KEY_HEADER } from "reinfolib"
```

Errors come in two forms:

- `ReinfolibValidationError` — thrown by `validateRequest` and the client before any network call. Carries `endpoint` and an `issues` array of `{ path, message }`.
- `ReinfolibApiError` — thrown for non-2xx HTTP or parsing failures. Carries `endpoint`, `status`, `statusText`, `url`, and `responseText`.

```ts
import { ReinfolibApiError, ReinfolibValidationError } from "reinfolib"

try {
  await client.xit001({ year: 2024, area: "13" })
} catch (error) {
  if (error instanceof ReinfolibValidationError) {
    // bad params, nothing was sent over the network
  } else if (error instanceof ReinfolibApiError) {
    console.error(error.status, error.url, error.responseText)
  }
}
```

## Endpoint methods

| ID | Methods | API | Response |
| --- | --- | --- | --- |
| XIT001 | `xit001` / `getRealEstatePrices` | 不動産価格（取引価格・成約価格）情報取得API | JSON |
| XIT002 | `xit002` / `getMunicipalities` | 都道府県内市区町村一覧取得API | JSON |
| XCT001 | `xct001` / `getAppraisalReports` | 鑑定評価書情報API | JSON |
| XPT001 | `xpt001` / `getRealEstatePricePoints` | 不動産価格（取引価格・成約価格）情報のポイント (点) API | GeoJSON/PBF tile |
| XPT002 | `xpt002` / `getLandPricePoints` | 地価公示・地価調査のポイント (点) API | GeoJSON/PBF tile |
| XKT001 | `xkt001` / `getUrbanPlanningAreas` | 都市計画決定GISデータ（都市計画区域/区域区分）API | GeoJSON/PBF tile |
| XKT002 | `xkt002` / `getUseDistricts` | 都市計画決定GISデータ（用途地域）API | GeoJSON/PBF tile |
| XKT003 | `xkt003` / `getLocationNormalizationPlans` | 都市計画決定GISデータ（立地適正化計画）API | GeoJSON/PBF tile |
| XKT004 | `xkt004` / `getElementarySchoolDistricts` | 国土数値情報（小学校区）API | GeoJSON/PBF tile |
| XKT005 | `xkt005` / `getJuniorHighSchoolDistricts` | 国土数値情報（中学校区）API | GeoJSON/PBF tile |
| XKT006 | `xkt006` / `getSchools` | 国土数値情報（学校）API | GeoJSON/PBF tile |
| XKT007 | `xkt007` / `getPreschools` | 国土数値情報（保育園・幼稚園等）API | GeoJSON/PBF tile |
| XKT010 | `xkt010` / `getMedicalFacilities` | 国土数値情報（医療機関）API | GeoJSON/PBF tile |
| XKT011 | `xkt011` / `getWelfareFacilities` | 国土数値情報（福祉施設）API | GeoJSON/PBF tile |
| XKT013 | `xkt013` / `getFuturePopulationMeshes` | 国土数値情報（将来推計人口250mメッシュ）API | GeoJSON/PBF tile |
| XKT014 | `xkt014` / `getFirePreventionDistricts` | 都市計画決定GISデータ（防火・準防火地域）API | GeoJSON/PBF tile |
| XKT015 | `xkt015` / `getStationPassengerCounts` | 国土数値情報（駅別乗降客数）API | GeoJSON/PBF tile |
| XKT016 | `xkt016` / `getDisasterRiskAreas` | 国土数値情報（災害危険区域）API | GeoJSON/PBF tile |
| XKT017 | `xkt017` / `getLibraries` | 国土数値情報（図書館）API | GeoJSON/PBF tile |
| XKT018 | `xkt018` / `getMunicipalOffices` | 国土数値情報（市区町村役場及び集会施設等）API | GeoJSON/PBF tile |
| XKT019 | `xkt019` / `getNaturalParks` | 国土数値情報（自然公園地域）API | GeoJSON/PBF tile |
| XKT020 | `xkt020` / `getLargeScaleEmbankments` | 国土数値情報（大規模盛土造成地マップ）API | GeoJSON/PBF tile |
| XKT021 | `xkt021` / `getLandslidePreventionAreas` | 国土数値情報（地すべり防止地区）API | GeoJSON/PBF tile |
| XKT022 | `xkt022` / `getSteepSlopeHazardAreas` | 国土数値情報（急傾斜地崩壊危険区域）API | GeoJSON/PBF tile |
| XKT023 | `xkt023` / `getDistrictPlans` | 都市計画決定GISデータ（地区計画）API | GeoJSON/PBF tile |
| XKT024 | `xkt024` / `getHighIntensityUseDistricts` | 都市計画決定GISデータ（高度利用地区）API | GeoJSON/PBF tile |
| XKT025 | `xkt025` / `getLiquefactionTendencyAreas` | 国土交通省都市局（地形区分に基づく液状化の発生傾向図）API | GeoJSON/PBF tile |
| XKT026 | `xkt026` / `getFloodInundationAreas` | 国土数値情報（洪水浸水想定区域（想定最大規模））API | GeoJSON/PBF tile |
| XKT027 | `xkt027` / `getStormSurgeInundationAreas` | 国土数値情報（高潮浸水想定区域）API | GeoJSON/PBF tile |
| XKT028 | `xkt028` / `getTsunamiInundationAreas` | 国土数値情報（津波浸水想定）API | GeoJSON/PBF tile |
| XKT029 | `xkt029` / `getSedimentDisasterHazardAreas` | 国土数値情報（土砂災害警戒区域）API | GeoJSON/PBF tile |
| XKT030 | `xkt030` / `getUrbanPlanningRoads` | 都市計画決定GISデータ（都市計画道路）API | GeoJSON/PBF tile |
| XKT031 | `xkt031` / `getDenselyInhabitedDistricts` | 国土数値情報（人口集中地区）API | GeoJSON/PBF tile |
| XGT001 | `xgt001` / `getEmergencyEvacuationSites` | 国土地理院GISデータ（指定緊急避難場所）API | GeoJSON/PBF tile |
| XST001 | `xst001` / `getDisasterHistory` | 国土調査（災害履歴）API | GeoJSON/PBF tile |

## Validation and errors

Request parameters are validated with Valibot. Validation failures throw `ReinfolibValidationError` with an `issues` array. Non-2xx HTTP and parsing failures follow `ofetch` behavior internally and are wrapped as `ReinfolibApiError` with `status`, `statusText`, `url`, `endpoint`, and `responseText` when available.

Response validation is intentionally not included in v1.

## Live sampling fixtures

Tests use mocks by default. To fetch a small, rate-limit-conscious live fixture manually:

```bash
REINFOLIB_API_KEY=... pnpm sample
```

The script skips when `REINFOLIB_API_KEY` is not set and writes sanitized output under `tests/fixtures/` when run.

## CI and publishing

This repository includes GitHub Actions workflows:

- `.github/workflows/ci.yml` runs install, typecheck, tests, build, and a `pnpm publish --dry-run` package check.
- `.github/workflows/publish.yml` publishes tag pushes to npm with GitHub OIDC trusted publishing and provenance.

Create a changelog, bump `package.json`, commit, tag, and create a GitHub release with changelogen:

```bash
pnpm release
```

Then push the generated commit and tag:

```bash
git push --follow-tags
```

Before the first release, configure npm trusted publishing for this package and workflow in npm, or with npm CLI:

```bash
npm trust github reinfolib --file .github/workflows/publish.yml --allow-publish
```

Publishing happens when a `v*` tag is pushed, or manually through the `Publish` workflow. No `NPM_TOKEN` secret is required for trusted publishing.

## License

MIT
