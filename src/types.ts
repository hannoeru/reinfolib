import type { FeatureCollection, Geometry, Point } from "geojson";
import type { FetchOptions, FetchResponse } from "ofetch";
import type { endpoints } from "./endpoint-data";
import type { PrefectureCode } from "./constants";

export type EndpointId = keyof typeof endpoints;
export type EndpointCategory = (typeof endpoints)[EndpointId]["category"];
export type ResponseFormat = "geojson" | "pbf";
export type Language = "ja" | "en";
export type StringNumber = string | number;
export type OneOrMany<T> = T | readonly T[];
export type Year = StringNumber;
export type Quarter = "1" | "2" | "3" | "4" | 1 | 2 | 3 | 4;
export type YearQuarter = `${number}${1 | 2 | 3 | 4}` | number;
export type PriceClassification = "01" | "02";
export type LandPriceClassification = "0" | "1" | 0 | 1;
export type LandTypeCode = "01" | "02" | "07" | "10" | "11";
export type AppraisalDivisionCode =
	| "00"
	| "03"
	| "05"
	| "07"
	| "09"
	| "10"
	| "13"
	| "20";
export type CityCode = string;
export type StationCode = string;
export type AdministrativeAreaCode = string;
export type StringCode = string;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> &
			Partial<Record<Exclude<Keys, K>, T[K]>>;
	}[Keys];
export interface TileXYZInput {
	z: StringNumber;
	x: StringNumber;
	y: StringNumber;
	zoom?: never;
	longitude?: never;
	latitude?: never;
}
export interface TileLonLatInput {
	zoom: StringNumber;
	longitude: number;
	latitude: number;
	z?: never;
	x?: never;
	y?: never;
}
export type TileInput<F extends ResponseFormat = ResponseFormat> = {
	responseFormat: F;
} & (TileXYZInput | TileLonLatInput);
export type TileEndpointRequest<
	F extends ResponseFormat,
	Extra extends object = object,
> = Extra & TileInput<F>;
export type EmptyTileResponse = [];
export type GeoJsonTileResponse<
	Properties extends object,
	G extends Geometry = Geometry,
> = FeatureCollection<G, Properties> | EmptyTileResponse;
export interface JsonEndpointEnvelope<Data> {
	status?: string;
	data: Data;
}
export type TileEndpointResponse<
	F extends ResponseFormat,
	GeoJson,
> = F extends "pbf" ? ArrayBuffer : GeoJson;
export type ReinfolibRequestOptions = Omit<
	FetchOptions,
	"baseURL" | "body" | "method" | "params" | "query" | "responseType"
>;
export interface EndpointParamDefinition {
	readonly name: string;
	readonly inputName: string;
	readonly kind: string;
	readonly required: boolean;
	readonly multiple: boolean;
	readonly description: string;
}
export interface EndpointDefinition {
	readonly id: string;
	readonly methodName: string;
	readonly alias: string;
	readonly path: string;
	readonly manualUrl: string;
	readonly category: string;
	readonly nameJa: string;
	readonly summaryEn: string;
	readonly kind: "json" | "tile";
	readonly minZoom?: number;
	readonly maxZoom?: number;
	readonly requireOneOf?: readonly string[];
	readonly params: readonly EndpointParamDefinition[];
	readonly responseFields: readonly string[];
}

export interface XIT001Record {
	Type?: string;
	Region?: string;
	MunicipalityCode?: string;
	Prefecture?: string;
	Municipality?: string;
	DistrictName?: string;
	TradePrice?: string;
	PricePerUnit?: string;
	FloorPlan?: string;
	Area?: string;
	UnitPrice?: string;
	LandShape?: string;
	Frontage?: string;
	TotalFloorArea?: string;
	BuildingYear?: string;
	Structure?: string;
	Use?: string;
	Purpose?: string;
	Direction?: string;
	Classification?: string;
	Breadth?: string;
	CityPlanning?: string;
	CoverageRatio?: string;
	FloorAreaRatio?: string;
	Period?: string;
	Renovation?: string;
	Remarks?: string;
	PriceCategory?: string;
	DistrictCode?: string;
}

export type XIT001Response = XIT001Record[];

export interface XIT002Record {
	id?: string;
	name?: string;
}

export type XIT002Response = XIT002Record[];

export interface XCT001Record {
	価格時点?: string;
	"標準地番号 市区町村コード 県コード"?: string;
	"標準地番号 市区町村コード 市区町村コード"?: string;
	"標準地番号 地域名"?: string;
	"標準地番号 用途区分コード"?: string;
	"標準地番号 連番"?: string;
	"1㎡当たりの価格"?: string;
	"路線価 年"?: string;
	"路線価 相続税路線価"?: string;
	"路線価 倍率"?: string;
	"路線価 倍率種別"?: string;
	"標準地 所在地 所在地番"?: string;
	"標準地 所在地 住居表示"?: string;
	"標準地 所在地 仮換地番号"?: string;
	"標準地 地積 地積"?: string;
	"標準地 地積 内私道分"?: string;
	"標準地 形状 形状"?: string;
	"標準地 形状 形状比 間口"?: string;
	"標準地 形状 形状比 奥行"?: string;
	"標準地 形状 方位"?: string;
	"標準地 形状 平坦"?: string;
	"標準地 形状 傾斜度"?: string;
	"標準地 土地利用の現況 現況"?: string;
	"標準地 土地利用の現況 構造コード"?: string;
	"標準地 土地利用の現況 地上階数"?: string;
	"標準地 土地利用の現況 地下階数"?: string;
	"標準地 周辺の利用状況"?: string;
	"標準地 接面道路の状況 前面道路 方位"?: string;
	"標準地 接面道路の状況 前面道路 駅前区分"?: string;
	"標準地 接面道路の状況 前面道路 高低位置"?: string;
	"標準地 接面道路の状況 前面道路 道路幅員"?: string;
	"標準地 接面道路の状況 前面道路 舗装状況"?: string;
	"標準地 接面道路の状況 前面道路 道路種別"?: string;
	"標準地 接面道路の状況 側道方位"?: string;
	"標準地 接面道路の状況 側道等接面状況"?: string;
	"標準地 供給処理施設 水道"?: string;
	"標準地 供給処理施設 ガス"?: string;
	"標準地 供給処理施設 下水道"?: string;
	"標準地 交通施設の状況 交通施設"?: string;
	"標準地 交通施設の状況 距離"?: string;
	"標準地 交通施設の状況 近接区分"?: string;
	"標準地 法令上の規制等 区域区分"?: string;
	"標準地 法令上の規制等 用途地域"?: string;
	"標準地 法令上の規制等 指定建蔽率"?: string;
	"標準地 法令上の規制等 指定容積率"?: string;
	"標準地 法令上の規制等 防火地域"?: string;
	"標準地 法令上の規制等 森林法"?: string;
	"標準地 法令上の規制等 自然公園法"?: string;
	"標準地 法令上の規制等 その他 その他地域地区等1"?: string;
	"標準地 法令上の規制等 その他 その他地域地区等2"?: string;
	"標準地 法令上の規制等 その他 その他地域地区等3"?: string;
	"標準地 法令上の規制等 その他 高度地区1 種"?: string;
	"標準地 法令上の規制等 その他 高度地区1 高度区分"?: string;
	"標準地 法令上の規制等 その他 高度地区1 高度"?: string;
	"標準地 法令上の規制等 その他 高度地区2 種"?: string;
	"標準地 法令上の規制等 その他 高度地区2 高度区分"?: string;
	"標準地 法令上の規制等 その他 高度地区2 高度"?: string;
	"標準地 法令上の規制等 その他 基準建蔽率"?: string;
	"標準地 法令上の規制等 その他 基準容積率"?: string;
	"標準地 法令上の規制等 自然環境等コード1"?: string;
	"標準地 法令上の規制等 自然環境等コード2"?: string;
	"標準地 法令上の規制等 自然環境等コード3"?: string;
	"標準地 法令上の規制等 自然環境等文言"?: string;
	"鑑定評価手法の適用 取引事例比較法比準価格"?: string;
	"鑑定評価手法の適用 控除法 控除後価格"?: string;
	"鑑定評価手法の適用 収益還元法 収益価格"?: string;
	"鑑定評価手法の適用 原価法 積算価格"?: string;
	"鑑定評価手法の適用 開発法 開発法による価格"?: string;
	"比準価格算定内訳事例a 取引価格"?: string;
	"比準価格算定内訳事例a 推定価格"?: string;
	"比準価格算定内訳事例a 標準価格"?: string;
	"比準価格算定内訳事例a 査定価格"?: string;
	"比準価格算定内訳事例b 取引価格"?: string;
	"比準価格算定内訳事例b 推定価格"?: string;
	"比準価格算定内訳事例b 標準価格"?: string;
	"比準価格算定内訳事例b 査定価格"?: string;
	"比準価格算定内訳事例c 取引価格"?: string;
	"比準価格算定内訳事例c 推定価格"?: string;
	"比準価格算定内訳事例c 標準価格"?: string;
	"比準価格算定内訳事例c 査定価格"?: string;
	"比準価格算定内訳事例d 取引価格"?: string;
	"比準価格算定内訳事例d 推定価格"?: string;
	"比準価格算定内訳事例d 標準価格"?: string;
	"比準価格算定内訳事例d 査定価格"?: string;
	"比準価格算定内訳事例e 取引価格"?: string;
	"比準価格算定内訳事例e 推定価格"?: string;
	"比準価格算定内訳事例e 標準価格"?: string;
	"比準価格算定内訳事例e 査定価格"?: string;
	積算価格算定内訳素地の取得価格?: string;
	積算価格算定内訳造成工事費?: string;
	積算価格算定内訳再調達原価?: string;
	収益価格算定内訳総収益?: string;
	収益価格算定内訳総費用?: string;
	収益価格算定内訳純収益?: string;
	収益価格算定内訳建物に帰属する純収益?: string;
	収益価格算定内訳土地に帰属する純収益?: string;
	収益価格算定内訳未収入期間修正後の純収益?: string;
	収益価格算定内訳還元利回り?: string;
	"開発法価格算定内訳 収入の現価の総和"?: string;
	"開発法価格算定内訳 支出の現価の総和"?: string;
	"開発法価格算定内訳 投下資本収益率"?: string;
	"開発法価格算定内訳 販売単価(住宅)"?: string;
	"開発法価格算定内訳 分譲可能床面積"?: string;
	"開発法価格算定内訳 建築工事費"?: string;
	"開発法価格算定内訳 延床面積"?: string;
	公示価格?: string;
	変動率?: string;
	緯度?: string;
	経度?: string;
}

export type XCT001Response = XCT001Record[];

export interface XPT001FeatureProperties {
	price_information_category_name_ja?: string;
	district_code?: string;
	city_code?: string;
	prefecture_name_ja?: string;
	city_name_ja?: string;
	district_name_ja?: string;
	u_transaction_price_total_ja?: string;
	u_unit_price_per_tsubo_ja?: string;
	floor_plan_name_ja?: string;
	u_area_ja?: string;
	u_transaction_price_unit_price_square_meter_ja?: string;
	land_shape_name_ja?: string;
	u_land_frontage_ja?: string;
	u_building_total_floor_area_ja?: string;
	u_construction_year_ja?: string;
	building_structure_name_ja?: string;
	land_use_name_ja?: string;
	future_use_purpose_name_ja?: string;
	front_road_azimuth_name_ja?: string;
	front_road_type_name_ja?: string;
	u_front_road_width_ja?: string;
	u_building_coverage_ratio_ja?: string;
	u_floor_area_ratio_ja?: string;
	point_in_time_name_ja?: string;
	remark_renovation_name_ja?: string;
	remark_name_ja?: string;
	land_type_name_ja?: string;
	use_category_name_ja?: string;
	building_use_name_ja?: string;
}

export type XPT001GeoJsonResponse = GeoJsonTileResponse<
	XPT001FeatureProperties,
	Point
>;
export type XPT001Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XPT001GeoJsonResponse>;

export interface XPT002FeatureProperties {
	point_id?: number | string;
	target_year_name_ja?: string;
	land_price_type?: number | string;
	prefecture_code?: string;
	prefecture_name_ja?: string;
	city_code?: string;
	use_category_name_ja?: string;
	standard_lot_number_ja?: string;
	city_county_name_ja?: string;
	ward_town_village_name_ja?: string;
	place_name_ja?: string;
	residence_display_name_ja?: string;
	location_number_ja?: string;
	u_current_years_price_ja?: string;
	last_years_price?: number | string;
	year_on_year_change_rate?: string;
	u_cadastral_ja?: string;
	frontage_ratio?: number | string;
	depth_ratio?: number | string;
	building_structure_name_ja?: string;
	u_ground_hierarchy_ja?: string;
	u_underground_hierarchy_ja?: string;
	front_road_name_ja?: string;
	front_road_azimuth_name_ja?: string;
	front_road_width?: number | string;
	front_road_pavement_condition?: string;
	side_road_azimuth_name_ja?: string;
	side_road_name_ja?: string;
	gas_supply_availability?: string;
	water_supply_availability?: string;
	sewer_supply_availability?: string;
	nearest_station_name_ja?: string;
	proximity_to_transportation_facilitites?: number | string;
	u_road_distance_to_nearest_station_name_ja?: string;
	usage_status_name_ja?: string;
	current_usage_status_of_surrounding_land_name_ja?: string;
	area_division_name_ja?: string;
	regulations_use_category_name_ja?: string;
	regulations_altitude_district_name_ja?: string;
	regulations_fireproof_name_ja?: string;
	u_regulations_building_coverage_ratio_ja?: string;
	u_regulations_floor_area_ratio_ja?: string;
	regulations_forest_law_name_ja?: string;
	regulations_park_law_name_ja?: string;
	pause_flag?: number | string;
	usage_category_name_ja?: string;
	location?: string;
	shape?: string;
	front_road_condition?: string;
	side_road_condition?: string;
	park_forest_law?: string;
}

export type XPT002GeoJsonResponse = GeoJsonTileResponse<
	XPT002FeatureProperties,
	Point
>;
export type XPT002Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XPT002GeoJsonResponse>;

export interface XKT001FeatureProperties {
	prefecture?: string;
	city_code?: string;
	city_name?: string;
	kubun_id?: number | string;
	decision_date?: string;
	decision_classification?: string;
	decision_maker?: string;
	notice_number?: string;
	area_classification_ja?: string;
	first_decision_date?: string;
	notice_number_s?: string;
}

export type XKT001GeoJsonResponse = GeoJsonTileResponse<
	XKT001FeatureProperties,
	Geometry
>;
export type XKT001Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT001GeoJsonResponse>;

export interface XKT002FeatureProperties {
	youto_id?: number | string;
	prefecture?: string;
	city_code?: string;
	city_name?: string;
	decision_date?: string;
	decision_classification?: string;
	decision_maker?: string;
	notice_number?: string;
	use_area_ja?: string;
	u_floor_area_ratio_ja?: string;
	u_building_coverage_ratio_ja?: string;
	first_decision_date?: string;
	notice_number_s?: string;
}

export type XKT002GeoJsonResponse = GeoJsonTileResponse<
	XKT002FeatureProperties,
	Geometry
>;
export type XKT002Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT002GeoJsonResponse>;

export interface XKT003FeatureProperties {
	prefecture?: string;
	city_code?: string;
	city_name?: string;
	decision_date?: string;
	decision_classification?: string;
	decision_maker?: string;
	notice_number?: string;
	kubun_id?: number | string;
	kubun_name_ja?: string;
	area_classification_ja?: string;
	first_decision_date?: string;
	notice_number_s?: string;
}

export type XKT003GeoJsonResponse = GeoJsonTileResponse<
	XKT003FeatureProperties,
	Geometry
>;
export type XKT003Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT003GeoJsonResponse>;

export interface XKT004FeatureProperties {
	A27_001?: string;
	A27_002?: string;
	A27_003?: string;
	A27_004_ja?: string;
	A27_005?: string;
}

export type XKT004GeoJsonResponse = GeoJsonTileResponse<
	XKT004FeatureProperties,
	Geometry
>;
export type XKT004Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT004GeoJsonResponse>;

export interface XKT005FeatureProperties {
	A32_001?: string;
	A32_002?: string;
	A32_003?: string;
	A32_004_ja?: string;
	A32_005?: string;
}

export type XKT005GeoJsonResponse = GeoJsonTileResponse<
	XKT005FeatureProperties,
	Geometry
>;
export type XKT005Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT005GeoJsonResponse>;

export interface XKT006FeatureProperties {
	P29_001?: string;
	P29_002?: string;
	P29_003?: number | string;
	P29_003_name_ja?: string;
	P29_004_ja?: string;
	P29_005_ja?: string;
	P29_006?: number | string;
	P29_007?: number | string;
	P29_008?: string;
	P29_009_ja?: string;
}

export type XKT006GeoJsonResponse = GeoJsonTileResponse<
	XKT006FeatureProperties,
	Geometry
>;
export type XKT006Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT006GeoJsonResponse>;

export interface XKT007FeatureProperties {
	administrativeAreaCode?: string;
	preSchoolName_ja?: string;
	schoolCode?: string;
	schoolClassCode?: number | string;
	schoolClassCode_name_ja?: string;
	location_ja?: string;
	administratorCode?: number | string;
	closeSchoolCode?: number | string;
}

export type XKT007GeoJsonResponse = GeoJsonTileResponse<
	XKT007FeatureProperties,
	Geometry
>;
export type XKT007Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT007GeoJsonResponse>;

export interface XKT010FeatureProperties {
	P04_001?: number | string;
	P04_001_name_ja?: string;
	P04_002_ja?: string;
	P04_003_ja?: string;
	P04_004?: string;
	P04_005?: string;
	P04_006?: string;
	P04_007?: number | string;
	P04_008?: number | string;
	P04_009?: number | string;
	P04_010?: number | string;
	medical_subject_ja?: string;
}

export type XKT010GeoJsonResponse = GeoJsonTileResponse<
	XKT010FeatureProperties,
	Geometry
>;
export type XKT010Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT010GeoJsonResponse>;

export interface XKT011FeatureProperties {
	P14_001?: string;
	P14_002?: string;
	P14_003?: string;
	P14_004_ja?: string;
	P14_005?: string;
	P14_005_name_ja?: string;
	P14_006?: string;
	P14_006_name_ja?: string;
	P14_007?: string;
	P14_008_ja?: string;
	P14_009?: number | string;
	P14_010?: number | string;
}

export type XKT011GeoJsonResponse = GeoJsonTileResponse<
	XKT011FeatureProperties,
	Geometry
>;
export type XKT011Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT011GeoJsonResponse>;

export interface XKT013FeatureProperties {
	MESH_ID?: string;
	SHICODE?: string;
	PTN_20XX?: string;
	HITOKU20XX?: string;
	GASSAN20XX?: number | string;
	PT00_20XX?: string;
	PT01_20XX?: string;
	PT02_20XX?: string;
	PT03_20XX?: string;
	PT04_20XX?: string;
	PT05_20XX?: string;
	PT06_20XX?: string;
	PT07_20XX?: string;
	PT08_20XX?: string;
	PT09_20XX?: string;
	PT10_20XX?: string;
	PT11_20XX?: string;
	PT12_20XX?: string;
	PT13_20XX?: string;
	PT14_20XX?: string;
	PT15_20XX?: string;
	PT16_20XX?: string;
	PT17_20XX?: string;
	PT18_20XX?: string;
	PT19_20XX?: string;
	PT20_20XX?: string;
	PTA_20XX?: string;
	PTB_20XX?: string;
	PTC_20XX?: string;
	PTD_20XX?: string;
	PTE_20XX?: string;
	RTA_20XX?: string;
	RTB_20XX?: string;
	RTC_20XX?: string;
	RTD_20XX?: string;
	RTE_20XX?: string;
}

export type XKT013GeoJsonResponse = GeoJsonTileResponse<
	XKT013FeatureProperties,
	Geometry
>;
export type XKT013Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT013GeoJsonResponse>;

export interface XKT014FeatureProperties {
	fire_prevention_ja?: string;
	kubun_id?: number | string;
	prefecture?: string;
	city_code?: string;
	city_name?: string;
	decision_date?: string;
	decision_classification?: string;
	decision_maker?: string;
	notice_number?: string;
	first_decision_date?: string;
	notice_number_s?: string;
}

export type XKT014GeoJsonResponse = GeoJsonTileResponse<
	XKT014FeatureProperties,
	Geometry
>;
export type XKT014Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT014GeoJsonResponse>;

export interface XKT015FeatureProperties {
	S12_001_ja?: string;
	S12_001c?: string;
	S12_001g?: string;
	S12_002_ja?: string;
	S12_003_ja?: string;
	S12_004?: string;
	S12_005?: string;
	S12_006?: string;
	S12_007?: string;
	S12_008?: string;
	S12_009?: number | string;
	S12_010?: string;
	S12_011?: string;
	S12_012?: string;
	S12_013?: number | string;
	S12_014?: string;
	S12_015?: string;
	S12_016?: string;
	S12_017?: number | string;
	S12_018?: string;
	S12_019?: string;
	S12_020?: string;
	S12_021?: number | string;
	S12_022?: string;
	S12_023?: string;
	S12_024?: string;
	S12_025?: number | string;
	S12_026?: string;
	S12_027?: string;
	S12_028?: string;
	S12_029?: number | string;
	S12_030?: string;
	S12_031?: string;
	S12_032?: string;
	S12_033?: number | string;
	S12_034?: string;
	S12_035?: string;
	S12_036?: string;
	S12_037?: number | string;
	S12_038?: string;
	S12_039?: string;
	S12_040?: string;
	S12_041?: number | string;
	S12_042?: string;
	S12_043?: string;
	S12_044?: string;
	S12_045?: number | string;
	S12_046?: string;
	S12_047?: string;
	S12_048?: string;
	S12_049?: number | string;
	S12_050?: string;
	S12_051?: string;
	S12_052?: string;
	S12_053?: number | string;
	S12_054?: string;
	S12_055?: string;
	S12_056?: string;
	S12_057?: number | string;
}

export type XKT015GeoJsonResponse = GeoJsonTileResponse<
	XKT015FeatureProperties,
	Geometry
>;
export type XKT015Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT015GeoJsonResponse>;

export interface XKT016FeatureProperties {
	A48_001?: string;
	A48_002?: string;
	A48_003?: string;
	A48_004?: number | string;
	A48_005_ja?: string;
	A48_006?: string;
	A48_007?: number | string;
	A48_007_name_ja?: string;
	A48_008_ja?: string;
	A48_009?: string;
	A48_010?: string;
	A48_011?: string;
	A48_012?: string;
	A48_013?: string;
	A48_014?: string;
}

export type XKT016GeoJsonResponse = GeoJsonTileResponse<
	XKT016FeatureProperties,
	Geometry
>;
export type XKT016Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT016GeoJsonResponse>;

export interface XKT017FeatureProperties {
	P27_001?: string;
	P27_002?: string;
	P27_003?: string;
	P27_003_name_ja?: string;
	P27_004?: string;
	P27_004_name_ja?: string;
	P27_005_ja?: string;
	P27_006_ja?: string;
	P27_007?: number | string;
	P27_008?: number | string;
	P27_009?: number | string;
}

export type XKT017GeoJsonResponse = GeoJsonTileResponse<
	XKT017FeatureProperties,
	Geometry
>;
export type XKT017Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT017GeoJsonResponse>;

export interface XKT018FeatureProperties {
	P05_001?: string;
	P05_002?: string;
	P05_002_name_ja?: string;
	P05_003_ja?: string;
	P05_004_ja?: string;
}

export type XKT018GeoJsonResponse = GeoJsonTileResponse<
	XKT018FeatureProperties,
	Geometry
>;
export type XKT018Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT018GeoJsonResponse>;

export interface XKT019FeatureProperties {
	OBJECTID?: number | string;
	PREFEC_CD?: string;
	AREA_CD?: string;
	CTV_NAME?: string;
	FIS_YEAR?: string;
	THEMA_NO?: number | string;
	LAYER_NO?: number | string;
	AREA_SIZE?: string;
	IOSIDE_DIV?: number | string;
	REMARK_STR?: string;
	Shape_Leng?: string;
	Shape_Area?: string;
	OBJ_NAME_ja?: string;
}

export type XKT019GeoJsonResponse = GeoJsonTileResponse<
	XKT019FeatureProperties,
	Geometry
>;
export type XKT019Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT019GeoJsonResponse>;

export interface XKT020FeatureProperties {
	embankment_classification?: string;
	prefecture_code?: string;
	prefecture_name?: string;
	city_code?: string;
	city_name?: string;
	embankment_number?: string;
}

export type XKT020GeoJsonResponse = GeoJsonTileResponse<
	XKT020FeatureProperties,
	Geometry
>;
export type XKT020Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT020GeoJsonResponse>;

export interface XKT021FeatureProperties {
	prefecture_code?: string;
	group_code?: string;
	city_name?: string;
	region_name?: string;
	address?: string;
	notice_date?: string;
	notice_number?: string;
	landslide_area?: string;
	charge_ministry_code?: number | string;
	prefecture_name?: string;
	charge_ministry_name?: string;
}

export type XKT021GeoJsonResponse = GeoJsonTileResponse<
	XKT021FeatureProperties,
	Geometry
>;
export type XKT021Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT021GeoJsonResponse>;

export interface XKT022FeatureProperties {
	prefecture_code?: string;
	group_code?: string;
	city_name?: string;
	region_name?: string;
	address?: string;
	public_notice_date?: string;
	public_notice_number?: string;
	landslide_area?: string;
	prefecture_name?: string;
}

export type XKT022GeoJsonResponse = GeoJsonTileResponse<
	XKT022FeatureProperties,
	Geometry
>;
export type XKT022Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT022GeoJsonResponse>;

export interface XKT023FeatureProperties {
	plan_name?: string;
	plan_type_ja?: string;
	kubun_id?: string;
	group_code?: string;
	decision_date?: string;
	decision_type_ja?: string;
	decision_maker?: string;
	notice_number?: string;
	prefecture?: string;
	city_name?: string;
	first_decision_date?: string;
	notice_number_s?: string;
}

export type XKT023GeoJsonResponse = GeoJsonTileResponse<
	XKT023FeatureProperties,
	Geometry
>;
export type XKT023Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT023GeoJsonResponse>;

export interface XKT024FeatureProperties {
	advanced_name?: string;
	advanced_type_ja?: string;
	kubun_id?: string;
	group_code?: string;
	decision_date?: string;
	decision_type_ja?: string;
	decision_maker?: string;
	notice_number?: string;
	prefecture?: string;
	city_name?: string;
	first_decision_date?: string;
	notice_number_s?: string;
}

export type XKT024GeoJsonResponse = GeoJsonTileResponse<
	XKT024FeatureProperties,
	Geometry
>;
export type XKT024Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT024GeoJsonResponse>;

export interface XKT025FeatureProperties {
	mesh_code?: string;
	topographic_classification_code?: number | string;
	topographic_classification_name_ja?: string;
	liquefaction_tendency_level?: number | string;
	note?: string;
}

export type XKT025GeoJsonResponse = GeoJsonTileResponse<
	XKT025FeatureProperties,
	Geometry
>;
export type XKT025Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT025GeoJsonResponse>;

export interface XKT026FeatureProperties {
	A31a_201?: string;
	A31a_202?: string;
	A31a_203?: string;
	A31a_204?: string;
	A31a_205?: number | string;
}

export type XKT026GeoJsonResponse = GeoJsonTileResponse<
	XKT026FeatureProperties,
	Geometry
>;
export type XKT026Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT026GeoJsonResponse>;

export interface XKT027FeatureProperties {
	A49_001?: string;
	A49_002?: string;
	A49_003?: string;
	target_year?: number | string;
}

export type XKT027GeoJsonResponse = GeoJsonTileResponse<
	XKT027FeatureProperties,
	Geometry
>;
export type XKT027Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT027GeoJsonResponse>;

export interface XKT028FeatureProperties {
	A40_001?: string;
	A40_002?: string;
	A40_003?: string;
	target_year?: number | string;
}

export type XKT028GeoJsonResponse = GeoJsonTileResponse<
	XKT028FeatureProperties,
	Geometry
>;
export type XKT028Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT028GeoJsonResponse>;

export interface XKT029FeatureProperties {
	A33_001?: number | string;
	A33_002?: number | string;
	A33_003?: string;
	A33_004?: string;
	A33_005?: string;
	A33_006?: string;
	A33_007?: string;
	A33_008?: number | string;
}

export type XKT029GeoJsonResponse = GeoJsonTileResponse<
	XKT029FeatureProperties,
	Geometry
>;
export type XKT029Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT029GeoJsonResponse>;

export interface XKT030FeatureProperties {
	planning_road_ja?: string;
	kubun_id?: number | string;
	prefecture?: string;
	city_code?: string;
	city_name?: string;
	first_decision_date?: string;
	decision_date?: string;
	decision_type_ja?: string;
	decision_maker?: string;
	notice_number_s?: string;
	notice_number?: string;
}

export type XKT030GeoJsonResponse = GeoJsonTileResponse<
	XKT030FeatureProperties,
	Geometry
>;
export type XKT030Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT030GeoJsonResponse>;

export interface XKT031FeatureProperties {
	A16_001?: string;
	A16_002?: string;
	A16_003?: string;
	A16_004?: number | string;
	A16_005?: number | string;
	A16_006?: string;
	A16_007?: number | string;
	A16_008?: string;
	A16_009?: string;
	A16_010?: string;
	A16_011?: number | string;
	A16_012?: number | string;
	A16_013?: number | string;
	A16_014?: number | string;
}

export type XKT031GeoJsonResponse = GeoJsonTileResponse<
	XKT031FeatureProperties,
	Geometry
>;
export type XKT031Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XKT031GeoJsonResponse>;

export interface XGT001FeatureProperties {
	common_id?: string;
	prefecture_and_city?: string;
	facility_name_ja?: string;
	address_ja?: string;
	flood_flag?: string;
	landslide_flag?: string;
	high_tide_flag?: string;
	earthquake_flag?: string;
	tsunami_flag?: string;
	large_fire_flag?: string;
	inland_flooding_flag?: string;
	volcanic_phenomenon_flag?: string;
	same_address_flag?: string;
	remarks?: string;
}

export type XGT001GeoJsonResponse = GeoJsonTileResponse<
	XGT001FeatureProperties,
	Geometry
>;
export type XGT001Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XGT001GeoJsonResponse>;

export interface XST001FeatureProperties {
	disastertype_code?: string;
	disaster_name_ja?: string;
	disaster_date?: string;
	disaster_source?: string;
}

export type XST001GeoJsonResponse = GeoJsonTileResponse<
	XST001FeatureProperties,
	Geometry
>;
export type XST001Response<F extends ResponseFormat = "geojson"> =
	TileEndpointResponse<F, XST001GeoJsonResponse>;

export type RealEstatePriceRecord = XIT001Record;
export type RealEstatePriceResponse = XIT001Response;
export type MunicipalityRecord = XIT002Record;
export type MunicipalityResponse = XIT002Response;
export type AppraisalReportRecord = XCT001Record;
export type AppraisalReportResponse = XCT001Response;
export type RealEstatePricePointProperties = XPT001FeatureProperties;
export type RealEstatePricePointGeoJsonResponse = XPT001GeoJsonResponse;
export type RealEstatePricePointResponse = XPT001Response;
export type LandPricePointProperties = XPT002FeatureProperties;
export type LandPricePointGeoJsonResponse = XPT002GeoJsonResponse;
export type LandPricePointResponse = XPT002Response;

export interface XIT001LocationParams {
	area?: OneOrMany<PrefectureCode>;
	city?: CityCode;
	station?: StationCode;
}
export type XIT001Request = RequireAtLeastOne<
	XIT001LocationParams,
	"area" | "city" | "station"
> & {
	priceClassification?: PriceClassification;
	year: Year;
	quarter?: Quarter;
	language?: Language;
};
export interface XIT002Request {
	area: PrefectureCode;
	language?: Language;
}
export interface XCT001Request {
	year: Year;
	area: OneOrMany<PrefectureCode>;
	division: AppraisalDivisionCode;
}
export type XPT001Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{
			from: YearQuarter;
			to: YearQuarter;
			priceClassification?: PriceClassification;
			landTypeCode?: OneOrMany<LandTypeCode>;
		}
	>;
export type XPT002Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{
			year: Year;
			priceClassification?: LandPriceClassification;
			useCategoryCode?: OneOrMany<AppraisalDivisionCode>;
		}
	>;
export type XKT001Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT002Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT003Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT004Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{ administrativeAreaCode?: OneOrMany<AdministrativeAreaCode> }
	>;
export type XKT005Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{ administrativeAreaCode?: OneOrMany<AdministrativeAreaCode> }
	>;
export type XKT006Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT007Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT010Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT011Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{
			administrativeAreaCode?: OneOrMany<AdministrativeAreaCode>;
			welfareFacilityClassCode?: OneOrMany<StringCode>;
			welfareFacilityMiddleClassCode?: OneOrMany<StringCode>;
			welfareFacilityMinorClassCode?: OneOrMany<StringCode>;
		}
	>;
export type XKT013Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT014Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT015Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT016Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{ administrativeAreaCode?: OneOrMany<AdministrativeAreaCode> }
	>;
export type XKT017Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{ administrativeAreaCode?: OneOrMany<AdministrativeAreaCode> }
	>;
export type XKT018Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT019Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{
			prefectureCode?: OneOrMany<PrefectureCode>;
			districtCode?: OneOrMany<StringCode>;
		}
	>;
export type XKT020Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT021Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{
			prefectureCode?: OneOrMany<PrefectureCode>;
			administrativeAreaCode?: OneOrMany<AdministrativeAreaCode>;
		}
	>;
export type XKT022Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{
			prefectureCode?: OneOrMany<PrefectureCode>;
			administrativeAreaCode?: OneOrMany<AdministrativeAreaCode>;
		}
	>;
export type XKT023Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT024Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT025Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT026Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT027Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT028Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT029Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT030Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XKT031Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<
		F,
		{ administrativeAreaCode?: OneOrMany<AdministrativeAreaCode> }
	>;
export type XGT001Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, object>;
export type XST001Request<F extends ResponseFormat = ResponseFormat> =
	TileEndpointRequest<F, { disastertypeCode?: OneOrMany<StringCode> }>;

export interface EndpointRequestMap {
	XIT001: XIT001Request;
	XIT002: XIT002Request;
	XCT001: XCT001Request;
	XPT001: XPT001Request;
	XPT002: XPT002Request;
	XKT001: XKT001Request;
	XKT002: XKT002Request;
	XKT003: XKT003Request;
	XKT004: XKT004Request;
	XKT005: XKT005Request;
	XKT006: XKT006Request;
	XKT007: XKT007Request;
	XKT010: XKT010Request;
	XKT011: XKT011Request;
	XKT013: XKT013Request;
	XKT014: XKT014Request;
	XKT015: XKT015Request;
	XKT016: XKT016Request;
	XKT017: XKT017Request;
	XKT018: XKT018Request;
	XKT019: XKT019Request;
	XKT020: XKT020Request;
	XKT021: XKT021Request;
	XKT022: XKT022Request;
	XKT023: XKT023Request;
	XKT024: XKT024Request;
	XKT025: XKT025Request;
	XKT026: XKT026Request;
	XKT027: XKT027Request;
	XKT028: XKT028Request;
	XKT029: XKT029Request;
	XKT030: XKT030Request;
	XKT031: XKT031Request;
	XGT001: XGT001Request;
	XST001: XST001Request;
}
export interface EndpointResponseMap {
	XIT001: XIT001Response;
	XIT002: XIT002Response;
	XCT001: XCT001Response;
	XPT001: XPT001Response;
	XPT002: XPT002Response;
	XKT001: XKT001Response;
	XKT002: XKT002Response;
	XKT003: XKT003Response;
	XKT004: XKT004Response;
	XKT005: XKT005Response;
	XKT006: XKT006Response;
	XKT007: XKT007Response;
	XKT010: XKT010Response;
	XKT011: XKT011Response;
	XKT013: XKT013Response;
	XKT014: XKT014Response;
	XKT015: XKT015Response;
	XKT016: XKT016Response;
	XKT017: XKT017Response;
	XKT018: XKT018Response;
	XKT019: XKT019Response;
	XKT020: XKT020Response;
	XKT021: XKT021Response;
	XKT022: XKT022Response;
	XKT023: XKT023Response;
	XKT024: XKT024Response;
	XKT025: XKT025Response;
	XKT026: XKT026Response;
	XKT027: XKT027Response;
	XKT028: XKT028Response;
	XKT029: XKT029Response;
	XKT030: XKT030Response;
	XKT031: XKT031Response;
	XGT001: XGT001Response;
	XST001: XST001Response;
}
export type EndpointRequest<T extends EndpointId> = EndpointRequestMap[T];
export type EndpointResponse<T extends EndpointId> = EndpointResponseMap[T];

export type JsonMethod<Params, Response> = (
	params: Params,
	options?: ReinfolibRequestOptions,
) => Promise<Response>;
export type JsonRawMethod<Params, Response> = (
	params: Params,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<JsonEndpointEnvelope<Response>>>;
export type UrlMethod<Params> = (params: Params) => string;
export type XIT001Method = JsonMethod<XIT001Request, XIT001Response>;
export type XIT001RawMethod = JsonRawMethod<XIT001Request, XIT001Response>;
export type XIT002Method = JsonMethod<XIT002Request, XIT002Response>;
export type XIT002RawMethod = JsonRawMethod<XIT002Request, XIT002Response>;
export type XCT001Method = JsonMethod<XCT001Request, XCT001Response>;
export type XCT001RawMethod = JsonRawMethod<XCT001Request, XCT001Response>;
export type XPT001Method = <F extends ResponseFormat>(
	params: XPT001Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XPT001Response<F>>;
export type XPT001RawMethod = <F extends ResponseFormat>(
	params: XPT001Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XPT001Response<F>>>;
export type XPT002Method = <F extends ResponseFormat>(
	params: XPT002Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XPT002Response<F>>;
export type XPT002RawMethod = <F extends ResponseFormat>(
	params: XPT002Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XPT002Response<F>>>;
export type XKT001Method = <F extends ResponseFormat>(
	params: XKT001Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT001Response<F>>;
export type XKT001RawMethod = <F extends ResponseFormat>(
	params: XKT001Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT001Response<F>>>;
export type XKT002Method = <F extends ResponseFormat>(
	params: XKT002Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT002Response<F>>;
export type XKT002RawMethod = <F extends ResponseFormat>(
	params: XKT002Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT002Response<F>>>;
export type XKT003Method = <F extends ResponseFormat>(
	params: XKT003Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT003Response<F>>;
export type XKT003RawMethod = <F extends ResponseFormat>(
	params: XKT003Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT003Response<F>>>;
export type XKT004Method = <F extends ResponseFormat>(
	params: XKT004Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT004Response<F>>;
export type XKT004RawMethod = <F extends ResponseFormat>(
	params: XKT004Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT004Response<F>>>;
export type XKT005Method = <F extends ResponseFormat>(
	params: XKT005Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT005Response<F>>;
export type XKT005RawMethod = <F extends ResponseFormat>(
	params: XKT005Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT005Response<F>>>;
export type XKT006Method = <F extends ResponseFormat>(
	params: XKT006Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT006Response<F>>;
export type XKT006RawMethod = <F extends ResponseFormat>(
	params: XKT006Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT006Response<F>>>;
export type XKT007Method = <F extends ResponseFormat>(
	params: XKT007Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT007Response<F>>;
export type XKT007RawMethod = <F extends ResponseFormat>(
	params: XKT007Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT007Response<F>>>;
export type XKT010Method = <F extends ResponseFormat>(
	params: XKT010Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT010Response<F>>;
export type XKT010RawMethod = <F extends ResponseFormat>(
	params: XKT010Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT010Response<F>>>;
export type XKT011Method = <F extends ResponseFormat>(
	params: XKT011Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT011Response<F>>;
export type XKT011RawMethod = <F extends ResponseFormat>(
	params: XKT011Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT011Response<F>>>;
export type XKT013Method = <F extends ResponseFormat>(
	params: XKT013Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT013Response<F>>;
export type XKT013RawMethod = <F extends ResponseFormat>(
	params: XKT013Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT013Response<F>>>;
export type XKT014Method = <F extends ResponseFormat>(
	params: XKT014Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT014Response<F>>;
export type XKT014RawMethod = <F extends ResponseFormat>(
	params: XKT014Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT014Response<F>>>;
export type XKT015Method = <F extends ResponseFormat>(
	params: XKT015Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT015Response<F>>;
export type XKT015RawMethod = <F extends ResponseFormat>(
	params: XKT015Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT015Response<F>>>;
export type XKT016Method = <F extends ResponseFormat>(
	params: XKT016Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT016Response<F>>;
export type XKT016RawMethod = <F extends ResponseFormat>(
	params: XKT016Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT016Response<F>>>;
export type XKT017Method = <F extends ResponseFormat>(
	params: XKT017Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT017Response<F>>;
export type XKT017RawMethod = <F extends ResponseFormat>(
	params: XKT017Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT017Response<F>>>;
export type XKT018Method = <F extends ResponseFormat>(
	params: XKT018Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT018Response<F>>;
export type XKT018RawMethod = <F extends ResponseFormat>(
	params: XKT018Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT018Response<F>>>;
export type XKT019Method = <F extends ResponseFormat>(
	params: XKT019Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT019Response<F>>;
export type XKT019RawMethod = <F extends ResponseFormat>(
	params: XKT019Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT019Response<F>>>;
export type XKT020Method = <F extends ResponseFormat>(
	params: XKT020Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT020Response<F>>;
export type XKT020RawMethod = <F extends ResponseFormat>(
	params: XKT020Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT020Response<F>>>;
export type XKT021Method = <F extends ResponseFormat>(
	params: XKT021Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT021Response<F>>;
export type XKT021RawMethod = <F extends ResponseFormat>(
	params: XKT021Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT021Response<F>>>;
export type XKT022Method = <F extends ResponseFormat>(
	params: XKT022Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT022Response<F>>;
export type XKT022RawMethod = <F extends ResponseFormat>(
	params: XKT022Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT022Response<F>>>;
export type XKT023Method = <F extends ResponseFormat>(
	params: XKT023Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT023Response<F>>;
export type XKT023RawMethod = <F extends ResponseFormat>(
	params: XKT023Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT023Response<F>>>;
export type XKT024Method = <F extends ResponseFormat>(
	params: XKT024Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT024Response<F>>;
export type XKT024RawMethod = <F extends ResponseFormat>(
	params: XKT024Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT024Response<F>>>;
export type XKT025Method = <F extends ResponseFormat>(
	params: XKT025Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT025Response<F>>;
export type XKT025RawMethod = <F extends ResponseFormat>(
	params: XKT025Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT025Response<F>>>;
export type XKT026Method = <F extends ResponseFormat>(
	params: XKT026Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT026Response<F>>;
export type XKT026RawMethod = <F extends ResponseFormat>(
	params: XKT026Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT026Response<F>>>;
export type XKT027Method = <F extends ResponseFormat>(
	params: XKT027Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT027Response<F>>;
export type XKT027RawMethod = <F extends ResponseFormat>(
	params: XKT027Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT027Response<F>>>;
export type XKT028Method = <F extends ResponseFormat>(
	params: XKT028Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT028Response<F>>;
export type XKT028RawMethod = <F extends ResponseFormat>(
	params: XKT028Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT028Response<F>>>;
export type XKT029Method = <F extends ResponseFormat>(
	params: XKT029Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT029Response<F>>;
export type XKT029RawMethod = <F extends ResponseFormat>(
	params: XKT029Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT029Response<F>>>;
export type XKT030Method = <F extends ResponseFormat>(
	params: XKT030Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT030Response<F>>;
export type XKT030RawMethod = <F extends ResponseFormat>(
	params: XKT030Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT030Response<F>>>;
export type XKT031Method = <F extends ResponseFormat>(
	params: XKT031Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XKT031Response<F>>;
export type XKT031RawMethod = <F extends ResponseFormat>(
	params: XKT031Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XKT031Response<F>>>;
export type XGT001Method = <F extends ResponseFormat>(
	params: XGT001Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XGT001Response<F>>;
export type XGT001RawMethod = <F extends ResponseFormat>(
	params: XGT001Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XGT001Response<F>>>;
export type XST001Method = <F extends ResponseFormat>(
	params: XST001Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<XST001Response<F>>;
export type XST001RawMethod = <F extends ResponseFormat>(
	params: XST001Request<F>,
	options?: ReinfolibRequestOptions,
) => Promise<FetchResponse<XST001Response<F>>>;

export interface ReinfolibRawClient {
	/** Raw response for XIT001. */
	xit001: XIT001RawMethod;
	/** Raw response for XIT002. */
	xit002: XIT002RawMethod;
	/** Raw response for XCT001. */
	xct001: XCT001RawMethod;
	/** Raw response for XPT001. */
	xpt001: XPT001RawMethod;
	/** Raw response for XPT002. */
	xpt002: XPT002RawMethod;
	/** Raw response for XKT001. */
	xkt001: XKT001RawMethod;
	/** Raw response for XKT002. */
	xkt002: XKT002RawMethod;
	/** Raw response for XKT003. */
	xkt003: XKT003RawMethod;
	/** Raw response for XKT004. */
	xkt004: XKT004RawMethod;
	/** Raw response for XKT005. */
	xkt005: XKT005RawMethod;
	/** Raw response for XKT006. */
	xkt006: XKT006RawMethod;
	/** Raw response for XKT007. */
	xkt007: XKT007RawMethod;
	/** Raw response for XKT010. */
	xkt010: XKT010RawMethod;
	/** Raw response for XKT011. */
	xkt011: XKT011RawMethod;
	/** Raw response for XKT013. */
	xkt013: XKT013RawMethod;
	/** Raw response for XKT014. */
	xkt014: XKT014RawMethod;
	/** Raw response for XKT015. */
	xkt015: XKT015RawMethod;
	/** Raw response for XKT016. */
	xkt016: XKT016RawMethod;
	/** Raw response for XKT017. */
	xkt017: XKT017RawMethod;
	/** Raw response for XKT018. */
	xkt018: XKT018RawMethod;
	/** Raw response for XKT019. */
	xkt019: XKT019RawMethod;
	/** Raw response for XKT020. */
	xkt020: XKT020RawMethod;
	/** Raw response for XKT021. */
	xkt021: XKT021RawMethod;
	/** Raw response for XKT022. */
	xkt022: XKT022RawMethod;
	/** Raw response for XKT023. */
	xkt023: XKT023RawMethod;
	/** Raw response for XKT024. */
	xkt024: XKT024RawMethod;
	/** Raw response for XKT025. */
	xkt025: XKT025RawMethod;
	/** Raw response for XKT026. */
	xkt026: XKT026RawMethod;
	/** Raw response for XKT027. */
	xkt027: XKT027RawMethod;
	/** Raw response for XKT028. */
	xkt028: XKT028RawMethod;
	/** Raw response for XKT029. */
	xkt029: XKT029RawMethod;
	/** Raw response for XKT030. */
	xkt030: XKT030RawMethod;
	/** Raw response for XKT031. */
	xkt031: XKT031RawMethod;
	/** Raw response for XGT001. */
	xgt001: XGT001RawMethod;
	/** Raw response for XST001. */
	xst001: XST001RawMethod;
	/** Raw response alias for XIT001. */
	getRealEstatePrices: XIT001RawMethod;
	/** Raw response alias for XIT002. */
	getMunicipalities: XIT002RawMethod;
	/** Raw response alias for XCT001. */
	getAppraisalReports: XCT001RawMethod;
	/** Raw response alias for XPT001. */
	getRealEstatePricePoints: XPT001RawMethod;
	/** Raw response alias for XPT002. */
	getLandPricePoints: XPT002RawMethod;
	/** Raw response alias for XKT001. */
	getUrbanPlanningAreas: XKT001RawMethod;
	/** Raw response alias for XKT002. */
	getUseDistricts: XKT002RawMethod;
	/** Raw response alias for XKT003. */
	getLocationNormalizationPlans: XKT003RawMethod;
	/** Raw response alias for XKT004. */
	getElementarySchoolDistricts: XKT004RawMethod;
	/** Raw response alias for XKT005. */
	getJuniorHighSchoolDistricts: XKT005RawMethod;
	/** Raw response alias for XKT006. */
	getSchools: XKT006RawMethod;
	/** Raw response alias for XKT007. */
	getPreschools: XKT007RawMethod;
	/** Raw response alias for XKT010. */
	getMedicalFacilities: XKT010RawMethod;
	/** Raw response alias for XKT011. */
	getWelfareFacilities: XKT011RawMethod;
	/** Raw response alias for XKT013. */
	getFuturePopulationMeshes: XKT013RawMethod;
	/** Raw response alias for XKT014. */
	getFirePreventionDistricts: XKT014RawMethod;
	/** Raw response alias for XKT015. */
	getStationPassengerCounts: XKT015RawMethod;
	/** Raw response alias for XKT016. */
	getDisasterRiskAreas: XKT016RawMethod;
	/** Raw response alias for XKT017. */
	getLibraries: XKT017RawMethod;
	/** Raw response alias for XKT018. */
	getMunicipalOffices: XKT018RawMethod;
	/** Raw response alias for XKT019. */
	getNaturalParks: XKT019RawMethod;
	/** Raw response alias for XKT020. */
	getLargeScaleEmbankments: XKT020RawMethod;
	/** Raw response alias for XKT021. */
	getLandslidePreventionAreas: XKT021RawMethod;
	/** Raw response alias for XKT022. */
	getSteepSlopeHazardAreas: XKT022RawMethod;
	/** Raw response alias for XKT023. */
	getDistrictPlans: XKT023RawMethod;
	/** Raw response alias for XKT024. */
	getHighIntensityUseDistricts: XKT024RawMethod;
	/** Raw response alias for XKT025. */
	getLiquefactionTendencyAreas: XKT025RawMethod;
	/** Raw response alias for XKT026. */
	getFloodInundationAreas: XKT026RawMethod;
	/** Raw response alias for XKT027. */
	getStormSurgeInundationAreas: XKT027RawMethod;
	/** Raw response alias for XKT028. */
	getTsunamiInundationAreas: XKT028RawMethod;
	/** Raw response alias for XKT029. */
	getSedimentDisasterHazardAreas: XKT029RawMethod;
	/** Raw response alias for XKT030. */
	getUrbanPlanningRoads: XKT030RawMethod;
	/** Raw response alias for XKT031. */
	getDenselyInhabitedDistricts: XKT031RawMethod;
	/** Raw response alias for XGT001. */
	getEmergencyEvacuationSites: XGT001RawMethod;
	/** Raw response alias for XST001. */
	getDisasterHistory: XST001RawMethod;
}
export interface ReinfolibUrlBuilder {
	/** Build URL for XIT001. */
	xit001: UrlMethod<XIT001Request>;
	/** Build URL for XIT002. */
	xit002: UrlMethod<XIT002Request>;
	/** Build URL for XCT001. */
	xct001: UrlMethod<XCT001Request>;
	/** Build URL for XPT001. */
	xpt001: UrlMethod<XPT001Request>;
	/** Build URL for XPT002. */
	xpt002: UrlMethod<XPT002Request>;
	/** Build URL for XKT001. */
	xkt001: UrlMethod<XKT001Request>;
	/** Build URL for XKT002. */
	xkt002: UrlMethod<XKT002Request>;
	/** Build URL for XKT003. */
	xkt003: UrlMethod<XKT003Request>;
	/** Build URL for XKT004. */
	xkt004: UrlMethod<XKT004Request>;
	/** Build URL for XKT005. */
	xkt005: UrlMethod<XKT005Request>;
	/** Build URL for XKT006. */
	xkt006: UrlMethod<XKT006Request>;
	/** Build URL for XKT007. */
	xkt007: UrlMethod<XKT007Request>;
	/** Build URL for XKT010. */
	xkt010: UrlMethod<XKT010Request>;
	/** Build URL for XKT011. */
	xkt011: UrlMethod<XKT011Request>;
	/** Build URL for XKT013. */
	xkt013: UrlMethod<XKT013Request>;
	/** Build URL for XKT014. */
	xkt014: UrlMethod<XKT014Request>;
	/** Build URL for XKT015. */
	xkt015: UrlMethod<XKT015Request>;
	/** Build URL for XKT016. */
	xkt016: UrlMethod<XKT016Request>;
	/** Build URL for XKT017. */
	xkt017: UrlMethod<XKT017Request>;
	/** Build URL for XKT018. */
	xkt018: UrlMethod<XKT018Request>;
	/** Build URL for XKT019. */
	xkt019: UrlMethod<XKT019Request>;
	/** Build URL for XKT020. */
	xkt020: UrlMethod<XKT020Request>;
	/** Build URL for XKT021. */
	xkt021: UrlMethod<XKT021Request>;
	/** Build URL for XKT022. */
	xkt022: UrlMethod<XKT022Request>;
	/** Build URL for XKT023. */
	xkt023: UrlMethod<XKT023Request>;
	/** Build URL for XKT024. */
	xkt024: UrlMethod<XKT024Request>;
	/** Build URL for XKT025. */
	xkt025: UrlMethod<XKT025Request>;
	/** Build URL for XKT026. */
	xkt026: UrlMethod<XKT026Request>;
	/** Build URL for XKT027. */
	xkt027: UrlMethod<XKT027Request>;
	/** Build URL for XKT028. */
	xkt028: UrlMethod<XKT028Request>;
	/** Build URL for XKT029. */
	xkt029: UrlMethod<XKT029Request>;
	/** Build URL for XKT030. */
	xkt030: UrlMethod<XKT030Request>;
	/** Build URL for XKT031. */
	xkt031: UrlMethod<XKT031Request>;
	/** Build URL for XGT001. */
	xgt001: UrlMethod<XGT001Request>;
	/** Build URL for XST001. */
	xst001: UrlMethod<XST001Request>;
	/** Build URL alias for XIT001. */
	getRealEstatePrices: UrlMethod<XIT001Request>;
	/** Build URL alias for XIT002. */
	getMunicipalities: UrlMethod<XIT002Request>;
	/** Build URL alias for XCT001. */
	getAppraisalReports: UrlMethod<XCT001Request>;
	/** Build URL alias for XPT001. */
	getRealEstatePricePoints: UrlMethod<XPT001Request>;
	/** Build URL alias for XPT002. */
	getLandPricePoints: UrlMethod<XPT002Request>;
	/** Build URL alias for XKT001. */
	getUrbanPlanningAreas: UrlMethod<XKT001Request>;
	/** Build URL alias for XKT002. */
	getUseDistricts: UrlMethod<XKT002Request>;
	/** Build URL alias for XKT003. */
	getLocationNormalizationPlans: UrlMethod<XKT003Request>;
	/** Build URL alias for XKT004. */
	getElementarySchoolDistricts: UrlMethod<XKT004Request>;
	/** Build URL alias for XKT005. */
	getJuniorHighSchoolDistricts: UrlMethod<XKT005Request>;
	/** Build URL alias for XKT006. */
	getSchools: UrlMethod<XKT006Request>;
	/** Build URL alias for XKT007. */
	getPreschools: UrlMethod<XKT007Request>;
	/** Build URL alias for XKT010. */
	getMedicalFacilities: UrlMethod<XKT010Request>;
	/** Build URL alias for XKT011. */
	getWelfareFacilities: UrlMethod<XKT011Request>;
	/** Build URL alias for XKT013. */
	getFuturePopulationMeshes: UrlMethod<XKT013Request>;
	/** Build URL alias for XKT014. */
	getFirePreventionDistricts: UrlMethod<XKT014Request>;
	/** Build URL alias for XKT015. */
	getStationPassengerCounts: UrlMethod<XKT015Request>;
	/** Build URL alias for XKT016. */
	getDisasterRiskAreas: UrlMethod<XKT016Request>;
	/** Build URL alias for XKT017. */
	getLibraries: UrlMethod<XKT017Request>;
	/** Build URL alias for XKT018. */
	getMunicipalOffices: UrlMethod<XKT018Request>;
	/** Build URL alias for XKT019. */
	getNaturalParks: UrlMethod<XKT019Request>;
	/** Build URL alias for XKT020. */
	getLargeScaleEmbankments: UrlMethod<XKT020Request>;
	/** Build URL alias for XKT021. */
	getLandslidePreventionAreas: UrlMethod<XKT021Request>;
	/** Build URL alias for XKT022. */
	getSteepSlopeHazardAreas: UrlMethod<XKT022Request>;
	/** Build URL alias for XKT023. */
	getDistrictPlans: UrlMethod<XKT023Request>;
	/** Build URL alias for XKT024. */
	getHighIntensityUseDistricts: UrlMethod<XKT024Request>;
	/** Build URL alias for XKT025. */
	getLiquefactionTendencyAreas: UrlMethod<XKT025Request>;
	/** Build URL alias for XKT026. */
	getFloodInundationAreas: UrlMethod<XKT026Request>;
	/** Build URL alias for XKT027. */
	getStormSurgeInundationAreas: UrlMethod<XKT027Request>;
	/** Build URL alias for XKT028. */
	getTsunamiInundationAreas: UrlMethod<XKT028Request>;
	/** Build URL alias for XKT029. */
	getSedimentDisasterHazardAreas: UrlMethod<XKT029Request>;
	/** Build URL alias for XKT030. */
	getUrbanPlanningRoads: UrlMethod<XKT030Request>;
	/** Build URL alias for XKT031. */
	getDenselyInhabitedDistricts: UrlMethod<XKT031Request>;
	/** Build URL alias for XGT001. */
	getEmergencyEvacuationSites: UrlMethod<XGT001Request>;
	/** Build URL alias for XST001. */
	getDisasterHistory: UrlMethod<XST001Request>;
}
export interface ReinfolibClient {
	fetch: typeof import("ofetch").$fetch;
	raw: ReinfolibRawClient;
	url: ReinfolibUrlBuilder;
	/**
	 * XIT001. 不動産価格（取引価格・成約価格）情報取得API
	 * Get real estate transaction and contract price records.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xit001/
	 */
	xit001: XIT001Method;
	/**
	 * XIT002. 都道府県内市区町村一覧取得API
	 * Get municipalities in a prefecture.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xit002/
	 */
	xit002: XIT002Method;
	/**
	 * XCT001. 鑑定評価書情報API
	 * Get official land appraisal report records.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xct001/
	 */
	xct001: XCT001Method;
	/**
	 * XPT001. 不動産価格（取引価格・成約価格）情報のポイント (点) API
	 * Get real estate price point vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xpt001/
	 */
	xpt001: XPT001Method;
	/**
	 * XPT002. 地価公示・地価調査のポイント (点) API
	 * Get official land price point vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xpt002/
	 */
	xpt002: XPT002Method;
	/**
	 * XKT001. 都市計画決定GISデータ（都市計画区域/区域区分）API
	 * Get urban planning area and area classification vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt001/
	 */
	xkt001: XKT001Method;
	/**
	 * XKT002. 都市計画決定GISデータ（用途地域）API
	 * Get land use district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt002/
	 */
	xkt002: XKT002Method;
	/**
	 * XKT003. 都市計画決定GISデータ（立地適正化計画）API
	 * Get location normalization plan vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt003/
	 */
	xkt003: XKT003Method;
	/**
	 * XKT004. 国土数値情報（小学校区）API
	 * Get elementary school district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt004/
	 */
	xkt004: XKT004Method;
	/**
	 * XKT005. 国土数値情報（中学校区）API
	 * Get junior high school district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt005/
	 */
	xkt005: XKT005Method;
	/**
	 * XKT006. 国土数値情報（学校）API
	 * Get school vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt006/
	 */
	xkt006: XKT006Method;
	/**
	 * XKT007. 国土数値情報（保育園・幼稚園等）API
	 * Get preschool and kindergarten vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt007/
	 */
	xkt007: XKT007Method;
	/**
	 * XKT010. 国土数値情報（医療機関）API
	 * Get medical facility vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt010/
	 */
	xkt010: XKT010Method;
	/**
	 * XKT011. 国土数値情報（福祉施設）API
	 * Get welfare facility vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt011/
	 */
	xkt011: XKT011Method;
	/**
	 * XKT013. 国土数値情報（将来推計人口250mメッシュ）API
	 * Get future population 250m mesh vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt013/
	 */
	xkt013: XKT013Method;
	/**
	 * XKT014. 都市計画決定GISデータ（防火・準防火地域）API
	 * Get fire prevention district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt014/
	 */
	xkt014: XKT014Method;
	/**
	 * XKT015. 国土数値情報（駅別乗降客数）API
	 * Get station passenger count vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt015/
	 */
	xkt015: XKT015Method;
	/**
	 * XKT016. 国土数値情報（災害危険区域）API
	 * Get disaster risk area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt016/
	 */
	xkt016: XKT016Method;
	/**
	 * XKT017. 国土数値情報（図書館）API
	 * Get library vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt017/
	 */
	xkt017: XKT017Method;
	/**
	 * XKT018. 国土数値情報（市区町村役場及び集会施設等）API
	 * Get municipal office and assembly facility vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt018/
	 */
	xkt018: XKT018Method;
	/**
	 * XKT019. 国土数値情報（自然公園地域）API
	 * Get natural park area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt019/
	 */
	xkt019: XKT019Method;
	/**
	 * XKT020. 国土数値情報（大規模盛土造成地マップ）API
	 * Get large-scale embankment map vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt020/
	 */
	xkt020: XKT020Method;
	/**
	 * XKT021. 国土数値情報（地すべり防止地区）API
	 * Get landslide prevention district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt021/
	 */
	xkt021: XKT021Method;
	/**
	 * XKT022. 国土数値情報（急傾斜地崩壊危険区域）API
	 * Get steep slope hazard area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt022/
	 */
	xkt022: XKT022Method;
	/**
	 * XKT023. 都市計画決定GISデータ（地区計画）API
	 * Get district plan vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt023/
	 */
	xkt023: XKT023Method;
	/**
	 * XKT024. 都市計画決定GISデータ（高度利用地区）API
	 * Get high-intensity use district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt024/
	 */
	xkt024: XKT024Method;
	/**
	 * XKT025. 国土交通省都市局（地形区分に基づく液状化の発生傾向図）API
	 * Get liquefaction tendency area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt025/
	 */
	xkt025: XKT025Method;
	/**
	 * XKT026. 国土数値情報（洪水浸水想定区域（想定最大規模））API
	 * Get flood inundation assumed area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt026/
	 */
	xkt026: XKT026Method;
	/**
	 * XKT027. 国土数値情報（高潮浸水想定区域）API
	 * Get storm surge inundation assumed area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt027/
	 */
	xkt027: XKT027Method;
	/**
	 * XKT028. 国土数値情報（津波浸水想定）API
	 * Get tsunami inundation assumed area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt028/
	 */
	xkt028: XKT028Method;
	/**
	 * XKT029. 国土数値情報（土砂災害警戒区域）API
	 * Get sediment disaster hazard area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt029/
	 */
	xkt029: XKT029Method;
	/**
	 * XKT030. 都市計画決定GISデータ（都市計画道路）API
	 * Get urban planning road vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt030/
	 */
	xkt030: XKT030Method;
	/**
	 * XKT031. 国土数値情報（人口集中地区）API
	 * Get densely inhabited district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt031/
	 */
	xkt031: XKT031Method;
	/**
	 * XGT001. 国土地理院GISデータ（指定緊急避難場所）API
	 * Get designated emergency evacuation site vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xgt001/
	 */
	xgt001: XGT001Method;
	/**
	 * XST001. 国土調査（災害履歴）API
	 * Get disaster history vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xst001/
	 */
	xst001: XST001Method;
	/**
	 * Alias for XIT001: XIT001. 不動産価格（取引価格・成約価格）情報取得API
	 * Get real estate transaction and contract price records.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xit001/
	 */
	getRealEstatePrices: XIT001Method;
	/**
	 * Alias for XIT002: XIT002. 都道府県内市区町村一覧取得API
	 * Get municipalities in a prefecture.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xit002/
	 */
	getMunicipalities: XIT002Method;
	/**
	 * Alias for XCT001: XCT001. 鑑定評価書情報API
	 * Get official land appraisal report records.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xct001/
	 */
	getAppraisalReports: XCT001Method;
	/**
	 * Alias for XPT001: XPT001. 不動産価格（取引価格・成約価格）情報のポイント (点) API
	 * Get real estate price point vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xpt001/
	 */
	getRealEstatePricePoints: XPT001Method;
	/**
	 * Alias for XPT002: XPT002. 地価公示・地価調査のポイント (点) API
	 * Get official land price point vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xpt002/
	 */
	getLandPricePoints: XPT002Method;
	/**
	 * Alias for XKT001: XKT001. 都市計画決定GISデータ（都市計画区域/区域区分）API
	 * Get urban planning area and area classification vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt001/
	 */
	getUrbanPlanningAreas: XKT001Method;
	/**
	 * Alias for XKT002: XKT002. 都市計画決定GISデータ（用途地域）API
	 * Get land use district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt002/
	 */
	getUseDistricts: XKT002Method;
	/**
	 * Alias for XKT003: XKT003. 都市計画決定GISデータ（立地適正化計画）API
	 * Get location normalization plan vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt003/
	 */
	getLocationNormalizationPlans: XKT003Method;
	/**
	 * Alias for XKT004: XKT004. 国土数値情報（小学校区）API
	 * Get elementary school district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt004/
	 */
	getElementarySchoolDistricts: XKT004Method;
	/**
	 * Alias for XKT005: XKT005. 国土数値情報（中学校区）API
	 * Get junior high school district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt005/
	 */
	getJuniorHighSchoolDistricts: XKT005Method;
	/**
	 * Alias for XKT006: XKT006. 国土数値情報（学校）API
	 * Get school vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt006/
	 */
	getSchools: XKT006Method;
	/**
	 * Alias for XKT007: XKT007. 国土数値情報（保育園・幼稚園等）API
	 * Get preschool and kindergarten vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt007/
	 */
	getPreschools: XKT007Method;
	/**
	 * Alias for XKT010: XKT010. 国土数値情報（医療機関）API
	 * Get medical facility vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt010/
	 */
	getMedicalFacilities: XKT010Method;
	/**
	 * Alias for XKT011: XKT011. 国土数値情報（福祉施設）API
	 * Get welfare facility vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt011/
	 */
	getWelfareFacilities: XKT011Method;
	/**
	 * Alias for XKT013: XKT013. 国土数値情報（将来推計人口250mメッシュ）API
	 * Get future population 250m mesh vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt013/
	 */
	getFuturePopulationMeshes: XKT013Method;
	/**
	 * Alias for XKT014: XKT014. 都市計画決定GISデータ（防火・準防火地域）API
	 * Get fire prevention district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt014/
	 */
	getFirePreventionDistricts: XKT014Method;
	/**
	 * Alias for XKT015: XKT015. 国土数値情報（駅別乗降客数）API
	 * Get station passenger count vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt015/
	 */
	getStationPassengerCounts: XKT015Method;
	/**
	 * Alias for XKT016: XKT016. 国土数値情報（災害危険区域）API
	 * Get disaster risk area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt016/
	 */
	getDisasterRiskAreas: XKT016Method;
	/**
	 * Alias for XKT017: XKT017. 国土数値情報（図書館）API
	 * Get library vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt017/
	 */
	getLibraries: XKT017Method;
	/**
	 * Alias for XKT018: XKT018. 国土数値情報（市区町村役場及び集会施設等）API
	 * Get municipal office and assembly facility vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt018/
	 */
	getMunicipalOffices: XKT018Method;
	/**
	 * Alias for XKT019: XKT019. 国土数値情報（自然公園地域）API
	 * Get natural park area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt019/
	 */
	getNaturalParks: XKT019Method;
	/**
	 * Alias for XKT020: XKT020. 国土数値情報（大規模盛土造成地マップ）API
	 * Get large-scale embankment map vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt020/
	 */
	getLargeScaleEmbankments: XKT020Method;
	/**
	 * Alias for XKT021: XKT021. 国土数値情報（地すべり防止地区）API
	 * Get landslide prevention district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt021/
	 */
	getLandslidePreventionAreas: XKT021Method;
	/**
	 * Alias for XKT022: XKT022. 国土数値情報（急傾斜地崩壊危険区域）API
	 * Get steep slope hazard area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt022/
	 */
	getSteepSlopeHazardAreas: XKT022Method;
	/**
	 * Alias for XKT023: XKT023. 都市計画決定GISデータ（地区計画）API
	 * Get district plan vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt023/
	 */
	getDistrictPlans: XKT023Method;
	/**
	 * Alias for XKT024: XKT024. 都市計画決定GISデータ（高度利用地区）API
	 * Get high-intensity use district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt024/
	 */
	getHighIntensityUseDistricts: XKT024Method;
	/**
	 * Alias for XKT025: XKT025. 国土交通省都市局（地形区分に基づく液状化の発生傾向図）API
	 * Get liquefaction tendency area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt025/
	 */
	getLiquefactionTendencyAreas: XKT025Method;
	/**
	 * Alias for XKT026: XKT026. 国土数値情報（洪水浸水想定区域（想定最大規模））API
	 * Get flood inundation assumed area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt026/
	 */
	getFloodInundationAreas: XKT026Method;
	/**
	 * Alias for XKT027: XKT027. 国土数値情報（高潮浸水想定区域）API
	 * Get storm surge inundation assumed area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt027/
	 */
	getStormSurgeInundationAreas: XKT027Method;
	/**
	 * Alias for XKT028: XKT028. 国土数値情報（津波浸水想定）API
	 * Get tsunami inundation assumed area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt028/
	 */
	getTsunamiInundationAreas: XKT028Method;
	/**
	 * Alias for XKT029: XKT029. 国土数値情報（土砂災害警戒区域）API
	 * Get sediment disaster hazard area vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt029/
	 */
	getSedimentDisasterHazardAreas: XKT029Method;
	/**
	 * Alias for XKT030: XKT030. 都市計画決定GISデータ（都市計画道路）API
	 * Get urban planning road vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt030/
	 */
	getUrbanPlanningRoads: XKT030Method;
	/**
	 * Alias for XKT031: XKT031. 国土数値情報（人口集中地区）API
	 * Get densely inhabited district vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xkt031/
	 */
	getDenselyInhabitedDistricts: XKT031Method;
	/**
	 * Alias for XGT001: XGT001. 国土地理院GISデータ（指定緊急避難場所）API
	 * Get designated emergency evacuation site vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xgt001/
	 */
	getEmergencyEvacuationSites: XGT001Method;
	/**
	 * Alias for XST001: XST001. 国土調査（災害履歴）API
	 * Get disaster history vector tile data.
	 * @see https://www.reinfolib.mlit.go.jp/help/apiManual/xst001/
	 */
	getDisasterHistory: XST001Method;
}
