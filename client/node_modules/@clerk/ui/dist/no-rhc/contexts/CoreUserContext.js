import React from "react";
import { __internal_useUserBase } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/contexts/CoreUserContext.tsx
function withCoreUserGuard(Component) {
	const Hoc = (props) => {
		if (!__internal_useUserBase()) return null;
		return /* @__PURE__ */ jsx(Component, { ...props });
	};
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	Hoc.displayName = displayName;
	return Hoc;
}

//#endregion
export { withCoreUserGuard };
//# sourceMappingURL=CoreUserContext.js.map