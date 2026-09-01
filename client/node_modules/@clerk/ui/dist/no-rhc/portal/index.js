import { HashRouter } from "../router/HashRouter.js";
import { PathRouter } from "../router/PathRouter.js";
import { VirtualRouter } from "../router/VirtualRouter.js";
import { ComponentContextProvider } from "../contexts/ClerkUIComponentsContext.js";
import { normalizeRoutingOptions } from "../utils/normalizeRoutingOptions.js";
import { clerkErrorPathRouterMissingPath } from "@clerk/shared/internal/clerk-js/errors";
import React, { Suspense } from "react";
import { PRESERVED_QUERYSTRING_PARAMS } from "@clerk/shared/internal/clerk-js/constants";
import { jsx } from "@emotion/react/jsx-runtime";
import ReactDOM from "react-dom";

//#region src/portal/index.tsx
function Portal({ props, component, componentName, node }) {
	const normalizedProps = {
		...props,
		...normalizeRoutingOptions({
			routing: props?.routing,
			path: props?.path
		})
	};
	const el = /* @__PURE__ */ jsx(ComponentContextProvider, {
		componentName,
		props: normalizedProps,
		children: /* @__PURE__ */ jsx(Suspense, {
			fallback: "",
			children: React.createElement(component, normalizedProps)
		})
	});
	if (normalizedProps?.routing === "path") {
		if (!normalizedProps?.path) clerkErrorPathRouterMissingPath(componentName);
		return ReactDOM.createPortal(/* @__PURE__ */ jsx(PathRouter, {
			preservedParams: PRESERVED_QUERYSTRING_PARAMS,
			basePath: normalizedProps.path,
			children: el
		}), node);
	}
	return ReactDOM.createPortal(/* @__PURE__ */ jsx(HashRouter, {
		preservedParams: PRESERVED_QUERYSTRING_PARAMS,
		children: el
	}), node);
}
var VirtualBodyRootPortal = class extends React.PureComponent {
	elRef = document.createElement("div");
	componentDidMount() {
		document.body.appendChild(this.elRef);
	}
	componentWillUnmount() {
		document.body.removeChild(this.elRef);
	}
	render() {
		const { props, startPath, component, componentName } = this.props;
		return ReactDOM.createPortal(/* @__PURE__ */ jsx(VirtualRouter, {
			startPath,
			children: /* @__PURE__ */ jsx(ComponentContextProvider, {
				componentName,
				props: props ?? {},
				children: /* @__PURE__ */ jsx(Suspense, {
					fallback: "",
					children: React.createElement(component, props)
				})
			})
		}), this.elRef);
	}
};

//#endregion
export { Portal, VirtualBodyRootPortal };
//# sourceMappingURL=index.js.map