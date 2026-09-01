import { useRouter } from "./RouteContext.js";
import { Route } from "./Route.js";
import React from "react";
import { Fragment as Fragment$1, jsx } from "@emotion/react/jsx-runtime";

//#region src/router/Switch.tsx
function assertRoute(v) {
	return !!v && React.isValidElement(v) && typeof v === "object" && v.type === Route;
}
function Switch({ children }) {
	const router = useRouter();
	let node = null;
	React.Children.forEach(children, (child) => {
		if (node || !assertRoute(child)) return;
		const { index, path } = child.props;
		if (!index && !path || router.matches(path, index)) node = child;
	});
	return /* @__PURE__ */ jsx(Fragment$1, { children: node });
}

//#endregion
export { Switch };
//# sourceMappingURL=Switch.js.map