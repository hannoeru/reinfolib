export const DEFAULT_BASE_URL =
	"https://www.reinfolib.mlit.go.jp/ex-api/external";
export const SUBSCRIPTION_KEY_HEADER = "Ocp-Apim-Subscription-Key";

export const PREFECTURES = [
	{ code: "01", nameJa: "北海道", nameEn: "Hokkaido" },
	{ code: "02", nameJa: "青森県", nameEn: "Aomori Prefecture" },
	{ code: "03", nameJa: "岩手県", nameEn: "Iwate Prefecture" },
	{ code: "04", nameJa: "宮城県", nameEn: "Miyagi Prefecture" },
	{ code: "05", nameJa: "秋田県", nameEn: "Akita Prefecture" },
	{ code: "06", nameJa: "山形県", nameEn: "Yamagata Prefecture" },
	{ code: "07", nameJa: "福島県", nameEn: "Fukushima Prefecture" },
	{ code: "08", nameJa: "茨城県", nameEn: "Ibaraki Prefecture" },
	{ code: "09", nameJa: "栃木県", nameEn: "Tochigi Prefecture" },
	{ code: "10", nameJa: "群馬県", nameEn: "Gunma Prefecture" },
	{ code: "11", nameJa: "埼玉県", nameEn: "Saitama Prefecture" },
	{ code: "12", nameJa: "千葉県", nameEn: "Chiba Prefecture" },
	{ code: "13", nameJa: "東京都", nameEn: "Tokyo" },
	{ code: "14", nameJa: "神奈川県", nameEn: "Kanagawa Prefecture" },
	{ code: "15", nameJa: "新潟県", nameEn: "Niigata Prefecture" },
	{ code: "16", nameJa: "富山県", nameEn: "Toyama Prefecture" },
	{ code: "17", nameJa: "石川県", nameEn: "Ishikawa Prefecture" },
	{ code: "18", nameJa: "福井県", nameEn: "Fukui Prefecture" },
	{ code: "19", nameJa: "山梨県", nameEn: "Yamanashi Prefecture" },
	{ code: "20", nameJa: "長野県", nameEn: "Nagano Prefecture" },
	{ code: "21", nameJa: "岐阜県", nameEn: "Gifu Prefecture" },
	{ code: "22", nameJa: "静岡県", nameEn: "Shizuoka Prefecture" },
	{ code: "23", nameJa: "愛知県", nameEn: "Aichi Prefecture" },
	{ code: "24", nameJa: "三重県", nameEn: "Mie Prefecture" },
	{ code: "25", nameJa: "滋賀県", nameEn: "Shiga Prefecture" },
	{ code: "26", nameJa: "京都府", nameEn: "Kyoto Prefecture" },
	{ code: "27", nameJa: "大阪府", nameEn: "Osaka Prefecture" },
	{ code: "28", nameJa: "兵庫県", nameEn: "Hyogo Prefecture" },
	{ code: "29", nameJa: "奈良県", nameEn: "Nara Prefecture" },
	{ code: "30", nameJa: "和歌山県", nameEn: "Wakayama Prefecture" },
	{ code: "31", nameJa: "鳥取県", nameEn: "Tottori Prefecture" },
	{ code: "32", nameJa: "島根県", nameEn: "Shimane Prefecture" },
	{ code: "33", nameJa: "岡山県", nameEn: "Okayama Prefecture" },
	{ code: "34", nameJa: "広島県", nameEn: "Hiroshima Prefecture" },
	{ code: "35", nameJa: "山口県", nameEn: "Yamaguchi Prefecture" },
	{ code: "36", nameJa: "徳島県", nameEn: "Tokushima Prefecture" },
	{ code: "37", nameJa: "香川県", nameEn: "Kagawa Prefecture" },
	{ code: "38", nameJa: "愛媛県", nameEn: "Ehime Prefecture" },
	{ code: "39", nameJa: "高知県", nameEn: "Kochi Prefecture" },
	{ code: "40", nameJa: "福岡県", nameEn: "Fukuoka Prefecture" },
	{ code: "41", nameJa: "佐賀県", nameEn: "Saga Prefecture" },
	{ code: "42", nameJa: "長崎県", nameEn: "Nagasaki Prefecture" },
	{ code: "43", nameJa: "熊本県", nameEn: "Kumamoto Prefecture" },
	{ code: "44", nameJa: "大分県", nameEn: "Oita Prefecture" },
	{ code: "45", nameJa: "宮崎県", nameEn: "Miyazaki Prefecture" },
	{ code: "46", nameJa: "鹿児島県", nameEn: "Kagoshima Prefecture" },
	{ code: "47", nameJa: "沖縄県", nameEn: "Okinawa Prefecture" },
] as const;

export type PrefectureCode = (typeof PREFECTURES)[number]["code"];

export function getPrefectureName(
	code: PrefectureCode,
	language: "ja" | "en" = "ja",
): string {
	const prefecture = PREFECTURES.find((item) => item.code === code);
	return language === "en"
		? (prefecture?.nameEn ?? code)
		: (prefecture?.nameJa ?? code);
}
