import { BaseRouter } from "./BaseRouter.js";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";
import { hasUrlInFragment, mergeFragmentIntoUrl, stripOrigin } from "@clerk/shared/internal/clerk-js/url";

//#region src/router/PathRouter.tsx
const PATH_REFRESH_EVENTS = [
	"pushstate",
	"replacestate",
	"popstate"
];
const PathRouter = ({ basePath, preservedParams, children }) => {
	const { navigate } = useClerk();
	const [stripped, setStripped] = React.useState(false);
	if (!navigate) throw new Error("Clerk: Missing navigate option.");
	const internalNavigate = (toURL, options) => {
		if (!toURL) return;
		return navigate(stripOrigin(toURL), options);
	};
	const getPath = () => {
		return window.location.pathname;
	};
	const getQueryString = () => {
		return window.location.search;
	};
	React.useEffect(() => {
		const convertHashToPath = async () => {
			if (hasUrlInFragment(window.location.hash)) {
				await internalNavigate(mergeFragmentIntoUrl(new URL(window.location.href)).href, { replace: true });
				setStripped(true);
			}
		};
		convertHashToPath();
	}, [
		setStripped,
		navigate,
		window.location.hash
	]);
	if (hasUrlInFragment(window.location.hash) && !stripped) return null;
	return /* @__PURE__ */ jsx(BaseRouter, {
		basePath: basePath.substring(1),
		startPath: "",
		getPath,
		getQueryString,
		internalNavigate,
		refreshEvents: PATH_REFRESH_EVENTS,
		preservedParams,
		children
	});
};

//#endregion
export { PathRouter };
//# sourceMappingURL=PathRouter.js.map