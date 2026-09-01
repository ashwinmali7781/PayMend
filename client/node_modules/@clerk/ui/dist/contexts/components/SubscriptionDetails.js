import { createContext, useContext } from "react";

//#region src/contexts/components/SubscriptionDetails.ts
const SubscriptionDetailsContext = createContext(null);
const useSubscriptionDetailsContext = () => {
	const context = useContext(SubscriptionDetailsContext);
	if (!context || context.componentName !== "SubscriptionDetails") throw new Error("Clerk: useSubscriptionDetailsContext called outside SubscriptionDetails.");
	const { componentName, ...ctx } = context;
	return {
		...ctx,
		componentName
	};
};

//#endregion
export { SubscriptionDetailsContext, useSubscriptionDetailsContext };
//# sourceMappingURL=SubscriptionDetails.js.map