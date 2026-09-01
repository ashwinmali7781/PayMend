import { assertContextExists } from "./utils.js";
import * as React$1 from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/contexts/EnvironmentContext.tsx
const EnvironmentContext = React$1.createContext(null);
function EnvironmentProvider({ children, value }) {
	return /* @__PURE__ */ jsx(EnvironmentContext.Provider, {
		value,
		children
	});
}
function useEnvironment() {
	const context = React$1.useContext(EnvironmentContext);
	assertContextExists(context, "EnvironmentProvider");
	return context;
}

//#endregion
export { EnvironmentProvider, useEnvironment };
//# sourceMappingURL=EnvironmentContext.js.map