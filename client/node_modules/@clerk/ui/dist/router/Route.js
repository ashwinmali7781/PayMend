import { RouteContext, useRouter } from "./RouteContext.js";
import { newPaths } from "./newPaths.js";
import { match } from "./pathToRegexp.js";
import { useNavigateToFlowStart } from "../hooks/useNavigateToFlowStart.js";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx } from "@emotion/react/jsx-runtime";
import { pathFromFullPath, trimTrailingSlash } from "@clerk/shared/internal/clerk-js/url";

//#region src/router/Route.tsx
const RouteGuard = ({ canActivate, children }) => {
	const { navigateToFlowStart } = useNavigateToFlowStart();
	const clerk = useClerk();
	React.useEffect(() => {
		if (!canActivate(clerk)) navigateToFlowStart();
	});
	if (canActivate(clerk)) return /* @__PURE__ */ jsx(Fragment$1, { children });
	return null;
};
function Route(props) {
	const router = useRouter();
	if (!props.children) return null;
	if (!props.index && !props.path) return /* @__PURE__ */ jsx(Fragment$1, { children: props.children });
	if (!router.matches(props.path, props.index)) return null;
	const [indexPath, fullPath] = newPaths(router.indexPath, router.fullPath, props.path, props.index);
	const resolve = (to, { searchParams } = {}) => {
		const url = new URL(to, window.location.origin + fullPath + "/");
		if (searchParams) url.search = searchParams.toString();
		url.pathname = trimTrailingSlash(url.pathname);
		return url;
	};
	const newGetMatchData = (path, index) => {
		const [newIndexPath, newFullPath] = newPaths(indexPath, fullPath, path, index);
		const currentPath = trimTrailingSlash(router.currentPath);
		const matchResult = path && match(newFullPath + "/:foo*")(currentPath) || index && match(newIndexPath)(currentPath) || index && match(newFullPath)(currentPath) || false;
		if (matchResult !== false) return matchResult.params;
		else return false;
	};
	const rawParams = router.getMatchData(props.path, props.index) || {};
	const paramsDict = {};
	for (const [key, value] of Object.entries(rawParams)) paramsDict[key] = value;
	const flowStartPath = (props.flowStart ? pathFromFullPath(router.fullPath).replace("/" + router.basePath, "") : router.flowStartPath) || router.startPath;
	return /* @__PURE__ */ jsx(RouteContext.Provider, {
		value: {
			basePath: router.basePath,
			startPath: router.startPath,
			flowStartPath,
			indexPath,
			fullPath,
			currentPath: router.currentPath,
			queryParams: router.queryParams,
			queryString: router.queryString,
			baseNavigate: router.baseNavigate,
			getMatchData: newGetMatchData,
			matches: (path, index) => {
				return newGetMatchData(path, index) ? true : false;
			},
			resolve,
			navigate: (to, { searchParams } = {}) => {
				const toURL = resolve(to, { searchParams });
				return router.baseNavigate(toURL);
			},
			refresh: router.refresh,
			params: paramsDict,
			urlStateParam: router.urlStateParam
		},
		children: props.canActivate ? /* @__PURE__ */ jsx(RouteGuard, {
			canActivate: props.canActivate,
			children: props.children
		}) : props.children
	});
}

//#endregion
export { Route };
//# sourceMappingURL=Route.js.map