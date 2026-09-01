import { titleize } from "@clerk/shared/underscore";
import { normalizeDate } from "@clerk/shared/date";

//#region src/localization/localizationModifiers.ts
const timeString = (val, locale) => {
	try {
		return new Intl.DateTimeFormat(locale || "en-US", { timeStyle: "short" }).format(normalizeDate(val));
	} catch (e) {
		console.warn(e);
		return "";
	}
};
const weekday = (val, locale, weekday) => {
	try {
		return new Intl.DateTimeFormat(locale || "en-US", { weekday: weekday || "long" }).format(normalizeDate(val));
	} catch (e) {
		console.warn(e);
		return "";
	}
};
/**
* Returns a short date string if the current year is the same as the date's year,
* otherwise returns a long date string.
*/
const shortDate = (val, locale) => {
	const date = normalizeDate(val);
	try {
		return new Intl.DateTimeFormat(locale || "en-US", {
			month: "short",
			day: "numeric",
			...date.getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear() ? { year: "numeric" } : {}
		}).format(normalizeDate(val));
	} catch (e) {
		console.warn(e);
		return "";
	}
};
/**
* Returns a long date string with the year.
*/
const longDate = (val, locale) => {
	try {
		return new Intl.DateTimeFormat(locale || "en-US", {
			month: "long",
			day: "numeric",
			year: "numeric"
		}).format(normalizeDate(val));
	} catch (e) {
		console.warn(e);
		return "";
	}
};
const numeric = (val, locale) => {
	try {
		return new Intl.DateTimeFormat(locale || "en-US").format(normalizeDate(val));
	} catch (e) {
		console.warn(e);
		return "";
	}
};
const link = (val, label) => {
	return `[${label}](${val})`;
};
const MODIFIERS = {
	titleize,
	timeString,
	weekday,
	numeric,
	link,
	shortDate,
	longDate
};

//#endregion
export { MODIFIERS };
//# sourceMappingURL=localizationModifiers.js.map