//#region src/foundations/createInternalTheme.ts
const createInternalTheme = (foundations) => {
	const res = {};
	const base = foundations;
	for (const scale in base) {
		res[scale] = {};
		for (const shade in base[scale]) res[scale]["$" + shade] = base[scale][shade];
	}
	return Object.freeze(res);
};

//#endregion
export { createInternalTheme };
//# sourceMappingURL=createInternalTheme.js.map