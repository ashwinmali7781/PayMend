import React from "react";
import { __internal_useSessionBase } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/contexts/CoreSessionContext.tsx
function withCoreSessionSwitchGuard(Component) {
	const Hoc = (props) => {
		/**
		* Avoid simply checking if session is falsy, checking against undefined is preferable as it means that clerk has not loaded yet
		*/
		if (typeof __internal_useSessionBase() === "undefined") return null;
		return /* @__PURE__ */ jsx(Component, { ...props });
	};
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	Hoc.displayName = displayName;
	return Hoc;
}

//#endregion
export { withCoreSessionSwitchGuard };
//# sourceMappingURL=CoreSessionContext.js.map