import { RouteContext } from "./RouteContext.js";
import { newPaths } from "./newPaths.js";
import { match } from "./pathToRegexp.js";
import { Route } from "./Route.js";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";
import { trimTrailingSlash } from "@clerk/shared/internal/clerk-js/url";
import { getQueryParams, stringifyQueryParams } from "@clerk/shared/internal/clerk-js/querystring";
import { withLeadingSlash } from "@clerk/shared/url";
import { flushSync } from "react-dom";

//#region src/router/BaseRouter.tsx
const isWindowRefreshEvent = (event) => {
	return event !== "pushstate" && event !== "replacestate";
};
const eventToNavigationType = {
	popstate: "traverse",
	pushstate: "push",
	replacestate: "replace"
};
const pushStateSubscribers = /* @__PURE__ */ new Set();
const replaceStateSubscribers = /* @__PURE__ */ new Set();
let originalPushState = null;
let originalReplaceState = null;
function ensurePushStatePatched() {
	if (originalPushState) return;
	const original = history.pushState.bind(history);
	originalPushState = original;
	history.pushState = (...args) => {
		original(...args);
		pushStateSubscribers.forEach((fn) => fn());
	};
}
function ensureReplaceStatePatched() {
	if (originalReplaceState) return;
	const original = history.replaceState.bind(history);
	originalReplaceState = original;
	history.replaceState = (...args) => {
		original(...args);
		replaceStateSubscribers.forEach((fn) => fn());
	};
}
/**
* Observes history changes so the router's internal state stays in sync
* with the URL. Uses the Navigation API when available, falling back to
* monkey-patching history.pushState/replaceState plus native window events.
*
* Note: `events` should be a stable array reference to avoid
* re-subscribing on every render.
*/
function useHistoryChangeObserver(events, callback) {
	const callbackRef = React.useRef(callback);
	callbackRef.current = callback;
	React.useEffect(() => {
		if (!events) return;
		const notify = () => callbackRef.current();
		const windowEvents = events.filter(isWindowRefreshEvent);
		const navigationTypes = events.map((e) => eventToNavigationType[e]).filter((type) => Boolean(type));
		if (typeof window !== "undefined" && "navigation" in window && typeof window.navigation?.addEventListener === "function") {
			const nav = window.navigation;
			const allowedTypes = new Set(navigationTypes);
			const handler = (e) => {
				if (allowedTypes.has(e.navigationType)) Promise.resolve().then(notify);
			};
			nav.addEventListener("currententrychange", handler);
			const unmappedEvents = windowEvents.filter((e) => !eventToNavigationType[e]);
			unmappedEvents.forEach((e) => window.addEventListener(e, notify));
			return () => {
				nav.removeEventListener("currententrychange", handler);
				unmappedEvents.forEach((e) => window.removeEventListener(e, notify));
			};
		}
		if (events.includes("pushstate")) {
			ensurePushStatePatched();
			pushStateSubscribers.add(notify);
		}
		if (events.includes("replacestate")) {
			ensureReplaceStatePatched();
			replaceStateSubscribers.add(notify);
		}
		windowEvents.forEach((e) => window.addEventListener(e, notify));
		return () => {
			pushStateSubscribers.delete(notify);
			replaceStateSubscribers.delete(notify);
			windowEvents.forEach((e) => window.removeEventListener(e, notify));
		};
	}, [events]);
}
const BaseRouter = ({ basePath, startPath, getPath, getQueryString, internalNavigate, refreshEvents, preservedParams, urlStateParam, children }) => {
	const { navigate: clerkNavigate } = useClerk();
	const normalizedBasePath = withLeadingSlash(basePath);
	const [routeParts, setRouteParts] = React.useState({
		path: getPath(),
		queryString: getQueryString()
	});
	const currentPath = routeParts.path;
	const currentQueryString = routeParts.queryString;
	const currentQueryParams = getQueryParams(routeParts.queryString);
	const resolve = (to) => {
		return new URL(to, window.location.origin);
	};
	const getMatchData = (path, index) => {
		const [newIndexPath, newFullPath] = newPaths("", "", path, index);
		const currentPathWithoutSlash = trimTrailingSlash(currentPath);
		const matchResult = path && match(newFullPath + "/:foo*")(currentPathWithoutSlash) || index && match(newIndexPath)(currentPathWithoutSlash) || index && match(newFullPath)(currentPathWithoutSlash) || false;
		if (matchResult !== false) return matchResult.params;
		else return false;
	};
	const matches = (path, index) => {
		return !!getMatchData(path, index);
	};
	const refresh = React.useCallback(() => {
		const newPath = getPath();
		const newQueryString = getQueryString();
		if (basePath && !newPath.startsWith(normalizedBasePath)) return;
		if (newPath !== currentPath || newQueryString !== currentQueryString) setRouteParts({
			path: newPath,
			queryString: newQueryString
		});
	}, [
		basePath,
		normalizedBasePath,
		currentPath,
		currentQueryString,
		getPath,
		getQueryString
	]);
	const isNavigatingRef = React.useRef(false);
	useHistoryChangeObserver(refreshEvents, React.useCallback(() => {
		if (isNavigatingRef.current) return;
		const newPath = getPath();
		if (basePath && !newPath.startsWith(normalizedBasePath)) return;
		refresh();
	}, [
		basePath,
		normalizedBasePath,
		getPath,
		refresh
	]));
	const baseNavigate = async (toURL) => {
		if (!toURL) return;
		const isCrossOrigin = toURL.origin !== window.location.origin;
		if (!toURL.pathname.startsWith(normalizedBasePath) || isCrossOrigin) {
			isNavigatingRef.current = true;
			try {
				return await clerkNavigate(toURL.href);
			} finally {
				isNavigatingRef.current = false;
			}
		}
		if (preservedParams) {
			const toQueryParams = getQueryParams(toURL.search);
			preservedParams.forEach((param) => {
				if (!toQueryParams[param] && currentQueryParams[param]) toQueryParams[param] = currentQueryParams[param];
			});
			toURL.search = stringifyQueryParams(toQueryParams);
		}
		isNavigatingRef.current = true;
		try {
			const internalNavRes = await internalNavigate(toURL, { metadata: { navigationType: "internal" } });
			flushSync(() => {
				setRouteParts({
					path: toURL.pathname,
					queryString: toURL.search
				});
			});
			return internalNavRes;
		} finally {
			isNavigatingRef.current = false;
		}
	};
	return /* @__PURE__ */ jsx(RouteContext.Provider, {
		value: {
			basePath,
			startPath,
			flowStartPath: startPath,
			fullPath: "",
			indexPath: "",
			currentPath,
			queryString: currentQueryString,
			queryParams: currentQueryParams,
			getMatchData: getMatchData.bind(void 0),
			matches: matches.bind(void 0),
			baseNavigate: baseNavigate.bind(void 0),
			navigate: async () => {},
			resolve: resolve.bind(void 0),
			refresh: refresh.bind(void 0),
			params: {},
			urlStateParam
		},
		children: /* @__PURE__ */ jsx(Route, {
			path: basePath,
			children
		})
	});
};

//#endregion
export { BaseRouter };
//# sourceMappingURL=BaseRouter.js.map