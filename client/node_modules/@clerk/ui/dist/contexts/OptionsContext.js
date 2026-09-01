import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/contexts/OptionsContext.tsx
const OptionsContext = React.createContext({});
function OptionsProvider({ children, value }) {
	return /* @__PURE__ */ jsx(OptionsContext.Provider, {
		value,
		children
	});
}
function useOptions() {
	const context = React.useContext(OptionsContext);
	if (context === void 0) throw new Error("useOptions must be used within an OptionsContext");
	return context;
}

//#endregion
export { OptionsContext, OptionsProvider, useOptions };
//# sourceMappingURL=OptionsContext.js.map