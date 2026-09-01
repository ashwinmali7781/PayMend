//#region src/utils/intl.ts
function listFormatSupportedLocalesOf(locale) {
	if (!locale) return false;
	const locales = Array.isArray(locale) ? locale : [locale];
	return Intl.ListFormat.supportedLocalesOf(locales).length === locales.length;
}
/**
* Intl.ListFormat was introduced in 2021
* It is recommended to first check for browser support before using it
*/
function canUseListFormat(locale) {
	return "ListFormat" in Intl && listFormatSupportedLocalesOf(locale);
}
function numberFormatSupportedLocalesOf(locale) {
	if (!locale) return false;
	try {
		return Intl.NumberFormat.supportedLocalesOf(locale).length > 0;
	} catch {
		return false;
	}
}
function canUseNumberFormat(locale) {
	return "NumberFormat" in Intl && numberFormatSupportedLocalesOf(locale);
}
function formatToCompactNumber(value, locale) {
	if (!canUseNumberFormat(locale)) return value.toString();
	return new Intl.NumberFormat(locale, { notation: "compact" }).format(value);
}

//#endregion
export { canUseListFormat, formatToCompactNumber };
//# sourceMappingURL=intl.js.map