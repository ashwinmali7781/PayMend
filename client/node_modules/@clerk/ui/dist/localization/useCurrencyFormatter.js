import { useCallback } from "react";

//#region src/localization/useCurrencyFormatter.ts
const formatters = /* @__PURE__ */ new Map();
function mapKey(locale, formattingOptions) {
	return locale + "-" + JSON.stringify(formattingOptions);
}
function getFormatter(locale, formattingOptions) {
	const key = mapKey(locale, formattingOptions);
	let formatter = formatters.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, formattingOptions);
		formatters.set(key, formatter);
	}
	return formatter;
}
function formatAmount(locale, amount, options) {
	try {
		const baseFormattingOptions = {
			style: "currency",
			currency: amount.currency !== "" ? amount.currency : "USD"
		};
		const baseFormatter = getFormatter(locale, baseFormattingOptions);
		const { maximumFractionDigits } = baseFormatter.resolvedOptions();
		let formatter = baseFormatter;
		if (options?.style === "short") formatter = getFormatter(locale, {
			...baseFormattingOptions,
			trailingZeroDisplay: "stripIfInteger"
		});
		return formatter.format(amount.amount / 10 ** (maximumFractionDigits ?? 2));
	} catch {
		return `${amount.currencySymbol}${amount.amountFormatted}`;
	}
}
function useCurrencyFormatter(locale) {
	return useCallback((amount, options) => formatAmount(locale, amount, options), [locale]);
}

//#endregion
export { useCurrencyFormatter };
//# sourceMappingURL=useCurrencyFormatter.js.map