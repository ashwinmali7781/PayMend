import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/contexts/ModuleManagerContext.tsx
const ModuleManagerContext = React.createContext(void 0);
const ModuleManagerProvider = ({ children, moduleManager }) => {
	return /* @__PURE__ */ jsx(ModuleManagerContext.Provider, {
		value: moduleManager,
		children
	});
};
const useModuleManager = () => {
	const context = React.useContext(ModuleManagerContext);
	if (!context) throw new Error("useModuleManager must be used within a ModuleManagerProvider");
	return context;
};

//#endregion
export { ModuleManagerProvider, useModuleManager };
//# sourceMappingURL=ModuleManagerContext.js.map