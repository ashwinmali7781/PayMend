//#region src/utils/createSlug.ts
const createSlug = (str) => {
	return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
};

//#endregion
export { createSlug };
//# sourceMappingURL=createSlug.js.map