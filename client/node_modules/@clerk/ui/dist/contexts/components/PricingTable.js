import { createContext, useContext } from "react";

//#region src/contexts/components/PricingTable.ts
const PricingTableContext = createContext(null);
const usePricingTableContext = () => {
	const context = useContext(PricingTableContext);
	if (!context || context.componentName !== "PricingTable") throw new Error("Clerk: usePricingTableContext called outside PricingTable.");
	const { componentName, ...ctx } = context;
	return {
		...ctx,
		componentName
	};
};

//#endregion
export { PricingTableContext, usePricingTableContext };
//# sourceMappingURL=PricingTable.js.map