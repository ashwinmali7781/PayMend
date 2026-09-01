import { useCheckoutContext } from "../../contexts/components/Checkout.js";
import { useEffect, useMemo } from "react";
import { __experimental_CheckoutProvider, __experimental_useCheckout } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/Checkout/CheckoutPage.tsx
const Initiator = () => {
	const { checkout } = __experimental_useCheckout();
	useEffect(() => {
		checkout.start();
	}, [checkout]);
	return null;
};
const Root = ({ children }) => {
	const { planId, planPeriod, for: _for, seatsQuantity, priceId } = useCheckoutContext();
	return /* @__PURE__ */ jsxs(__experimental_CheckoutProvider, {
		for: _for,
		planId,
		planPeriod,
		seatsQuantity,
		priceId,
		children: [/* @__PURE__ */ jsx(Initiator, {}), children]
	});
};
const Stage = ({ children, name }) => {
	const { checkout } = __experimental_useCheckout();
	if (checkout.status !== name) return null;
	return children;
};
const FetchStatus = ({ children, status }) => {
	const { errors, fetchStatus } = __experimental_useCheckout();
	if (useMemo(() => {
		if (errors.global) {
			const errorCodes = errors.global.flatMap((e) => {
				if (e.isClerkAPIResponseError()) return e.errors.map((e) => e.code);
			});
			if (errorCodes.includes("missing_payer_email")) return "missing_payer_email";
			if (errorCodes.includes("invalid_plan_change")) return "invalid_plan_change";
			return "generic_error";
		}
		return fetchStatus;
	}, [fetchStatus]) !== status) return null;
	return children;
};

//#endregion
export { FetchStatus, Root, Stage };
//# sourceMappingURL=CheckoutPage.js.map