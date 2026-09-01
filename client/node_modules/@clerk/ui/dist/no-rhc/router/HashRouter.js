import { BaseRouter } from "./BaseRouter.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";
import { hasUrlInFragment, stripOrigin } from "@clerk/shared/internal/clerk-js/url";

//#region src/router/HashRouter.tsx
const hashRouterBase = "CLERK-ROUTER/HASH";
const HASH_REFRESH_EVENTS = [
	"pushstate",
	"replacestate",
	"popstate",
	"hashchange"
];
const HashRouter = ({ preservedParams, children }) => {
	const internalNavigate = async (toURL) => {
		if (!toURL) return;
		window.location.hash = stripOrigin(toURL).substring(18);
		return Promise.resolve();
	};
	const fakeUrl = () => {
		if (hasUrlInFragment(window.location.hash)) return new URL(window.location.origin + window.location.hash.substring(1));
		else return new URL(window.location.origin);
	};
	const getPath = () => {
		return fakeUrl().pathname === "/" ? "/CLERK-ROUTER/HASH" : "/CLERK-ROUTER/HASH" + fakeUrl().pathname;
	};
	const getQueryString = () => {
		return fakeUrl().search;
	};
	return /* @__PURE__ */ jsx(BaseRouter, {
		getPath,
		basePath: hashRouterBase,
		startPath: "",
		getQueryString,
		internalNavigate,
		refreshEvents: HASH_REFRESH_EVENTS,
		preservedParams,
		children
	});
};

//#endregion
export { HashRouter, hashRouterBase };
//# sourceMappingURL=HashRouter.js.map