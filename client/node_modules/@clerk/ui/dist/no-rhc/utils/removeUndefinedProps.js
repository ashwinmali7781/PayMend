//#region src/utils/removeUndefinedProps.ts
const removeUndefinedProps = (obj) => {
	Object.keys(obj).forEach((key) => obj[key] === void 0 && delete obj[key]);
	return obj;
};

//#endregion
export { removeUndefinedProps };
//# sourceMappingURL=removeUndefinedProps.js.map