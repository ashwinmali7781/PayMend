//#region src/themes/createTheme.ts
const createTheme = (themeParams) => {
	return {
		...themeParams,
		__type: "prebuilt_appearance"
	};
};

//#endregion
export { createTheme };
//# sourceMappingURL=createTheme.js.map