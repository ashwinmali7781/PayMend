import { Route } from "../../router/Route.js";
import { Switch } from "../../router/Switch.js";
import { withCoreSessionSwitchGuard } from "../../contexts/CoreSessionContext.js";
import { Flow } from "../../customizables/Flow.js";
import { OneTapStart } from "./one-tap-start.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/GoogleOneTap/index.tsx
function OneTapRoutes() {
	return /* @__PURE__ */ jsx(Route, {
		path: "one-tap",
		children: /* @__PURE__ */ jsx(Flow.Root, {
			flow: "oneTap",
			children: /* @__PURE__ */ jsx(Switch, { children: /* @__PURE__ */ jsx(Route, {
				index: true,
				children: /* @__PURE__ */ jsx(OneTapStart, {})
			}) })
		})
	});
}
OneTapRoutes.displayName = "OneTap";
const OneTap = withCoreSessionSwitchGuard(OneTapRoutes);

//#endregion
export { OneTap };
//# sourceMappingURL=index.js.map