//#region src/utils/fromEntries.ts
const fromEntries = (iterable) => {
	return [...iterable].reduce((obj, [key, val]) => {
		obj[key] = val;
		return obj;
	}, {});
};

//#endregion
export { fromEntries };
//# sourceMappingURL=fromEntries.js.map