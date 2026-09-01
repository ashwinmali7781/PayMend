//#region src/utils/readObjectPath.ts
const readObjectPath = (obj, path) => {
	const props = (path || "").split(".");
	let cur = obj;
	for (let i = 0; i < props.length; i++) {
		cur = cur[props[i]];
		if (cur === void 0) return;
	}
	return cur;
};

//#endregion
export { readObjectPath };
//# sourceMappingURL=readObjectPath.js.map