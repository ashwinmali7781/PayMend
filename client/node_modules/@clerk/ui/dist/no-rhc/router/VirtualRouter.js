import { useClerkModalStateParams } from "../hooks/useClerkModalStateParams.js";
import { BaseRouter } from "./BaseRouter.js";
import React, { useEffect } from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";
import { VIRTUAL_ROUTER_BASE_PATH } from "@clerk/shared/internal/clerk-js/url";

//#region src/router/VirtualRouter.tsx
const VirtualRouter = ({ startPath, preservedParams, onExternalNavigate, children }) => {
	const { __internal_addNavigationListener } = useClerk();
	const [currentURL, setCurrentURL] = React.useState(new URL("/" + VIRTUAL_ROUTER_BASE_PATH + startPath, window.location.origin));
	const { urlStateParam, removeQueryParam } = useClerkModalStateParams();
	useEffect(() => {
		let unsubscribe = () => {};
		if (onExternalNavigate) unsubscribe = __internal_addNavigationListener(onExternalNavigate);
		return () => {
			unsubscribe();
		};
	}, []);
	if (urlStateParam.componentName) removeQueryParam();
	const internalNavigate = (toURL) => {
		if (!toURL) return;
		setCurrentURL(toURL);
	};
	const getPath = () => currentURL.pathname;
	const getQueryString = () => currentURL.search;
	return /* @__PURE__ */ jsx(BaseRouter, {
		getPath,
		basePath: VIRTUAL_ROUTER_BASE_PATH,
		startPath,
		getQueryString,
		internalNavigate,
		preservedParams,
		urlStateParam,
		children
	});
};

//#endregion
export { VIRTUAL_ROUTER_BASE_PATH, VirtualRouter };
//# sourceMappingURL=VirtualRouter.js.map