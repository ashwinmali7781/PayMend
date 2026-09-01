import { useOptions } from "../OptionsContext.js";
import { createContext, useContext, useMemo } from "react";
import { useClerk } from "@clerk/shared/react";
import { isAllowedRedirect } from "@clerk/shared/internal/clerk-js/url";

//#region src/contexts/components/Checkout.ts
const CheckoutContext = createContext(null);
const useCheckoutContext = () => {
	const context = useContext(CheckoutContext);
	const clerk = useClerk();
	const options = useOptions();
	if (!context || context.componentName !== "Checkout") throw new Error("Clerk: useCheckoutContext called outside Checkout.");
	const newSubscriptionRedirectUrl = useMemo(() => {
		if (context.portalRoot) return;
		const url = context.newSubscriptionRedirectUrl || clerk.buildNewSubscriptionRedirectUrl?.();
		return isAllowedRedirect(options?.allowedRedirectOrigins, window.location.origin)(url) ? url : void 0;
	}, [
		context.portalRoot,
		context.newSubscriptionRedirectUrl,
		clerk,
		options?.allowedRedirectOrigins
	]);
	const { componentName, ...ctx } = context;
	return {
		...ctx,
		componentName,
		newSubscriptionRedirectUrl
	};
};

//#endregion
export { CheckoutContext, useCheckoutContext };
//# sourceMappingURL=Checkout.js.map