//#region src/utils/mergeRefs.ts
const mergeRefs = (...refs) => {
	return (node) => {
		for (const _ref of refs) if (_ref) _ref.current = node;
	};
};

//#endregion
export { mergeRefs };
//# sourceMappingURL=mergeRefs.js.map