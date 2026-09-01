//#region src/utils/buildVirtualRouterUrl.ts
const buildVirtualRouterUrl = ({ base, path }) => {
	if (!path) return base;
	return base + path;
};

//#endregion
export { buildVirtualRouterUrl };
//# sourceMappingURL=buildVirtualRouterUrl.js.map