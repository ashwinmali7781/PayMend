import React from "react";

//#region src/router/RouteContext.tsx
const RouteContext = React.createContext(null);
RouteContext.displayName = "RouteContext";
const useRouter = () => {
	const ctx = React.useContext(RouteContext);
	if (!ctx) throw new Error("useRouter called while Router is null");
	return ctx;
};

//#endregion
export { RouteContext, useRouter };
//# sourceMappingURL=RouteContext.js.map