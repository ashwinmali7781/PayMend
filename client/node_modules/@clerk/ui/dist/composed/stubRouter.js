//#region src/composed/stubRouter.ts
const SSR_BASE = "http://localhost/";
function unsupported(api) {
	throw new Error(`[@clerk/ui composed] router.${api} is not supported inside composed sections. Composed sections are leaf-only — <Route>, navigateToFlowStart(), router.refresh(), getMatchData() and urlStateParam are AIO-only. Move routing to the consumer.`);
}
function maybeUnsupported(api, prodValue) {
	unsupported(api);
	return prodValue;
}
function createComposedRouter(clerkNavigate, currentPath = "") {
	return {
		basePath: "",
		startPath: "",
		flowStartPath: "",
		fullPath: "",
		indexPath: "",
		currentPath,
		matches: () => maybeUnsupported("matches()", false),
		navigate: async (to) => {
			await clerkNavigate(to);
		},
		baseNavigate: async (toURL) => {
			await clerkNavigate(toURL.href);
		},
		resolve: (to) => new URL(to, typeof window !== "undefined" ? window.location.href : SSR_BASE),
		refresh: () => maybeUnsupported("refresh()", void 0),
		params: {},
		queryString: "",
		queryParams: {},
		getMatchData: () => maybeUnsupported("getMatchData()", false)
	};
}
const stubRouter = createComposedRouter((to) => {
	if (typeof window !== "undefined") window.location.assign(to);
	return Promise.resolve();
});

//#endregion
export { createComposedRouter, stubRouter };
//# sourceMappingURL=stubRouter.js.map