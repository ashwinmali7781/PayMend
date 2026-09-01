import { createContext, useContext } from "react";

//#region src/contexts/components/APIKeys.ts
const APIKeysContext = createContext(null);
const useAPIKeysContext = () => {
	const context = useContext(APIKeysContext);
	if (!context || context.componentName !== "APIKeys") throw new Error("Clerk: useAPIKeysContext called outside APIKeys.");
	const { componentName, ...ctx } = context;
	return {
		...ctx,
		componentName
	};
};

//#endregion
export { APIKeysContext, useAPIKeysContext };
//# sourceMappingURL=APIKeys.js.map