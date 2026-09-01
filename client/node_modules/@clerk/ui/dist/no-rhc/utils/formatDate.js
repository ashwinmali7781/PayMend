//#region src/utils/formatDate.ts
function formatDate(date, format = "long", locale = "en-US") {
	const options = {
		month: format === "short" ? "short" : "long",
		...format !== "monthyear" && { day: "numeric" },
		...format !== "short" && { year: "numeric" }
	};
	return new Intl.DateTimeFormat(locale, options).format(date);
}

//#endregion
export { formatDate };
//# sourceMappingURL=formatDate.js.map