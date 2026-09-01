import { Checkout } from "./components.js";
import { LazyDrawerRenderer } from "./providers.js";
import { useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/lazyModules/MountedCheckoutDrawer.tsx
function MountedCheckoutDrawer({ appearance, checkoutDrawer, onOpenChange }) {
	const { user } = useUser();
	if (!checkoutDrawer.props) return null;
	return /* @__PURE__ */ jsx(LazyDrawerRenderer, {
		globalAppearance: appearance,
		appearanceKey: "checkout",
		componentAppearance: checkoutDrawer.props.appearance || {},
		flowName: "checkout",
		open: checkoutDrawer.open,
		onOpenChange,
		componentName: "Checkout",
		portalId: checkoutDrawer.props?.portalId,
		portalRoot: checkoutDrawer.props?.portalRoot,
		children: checkoutDrawer.props && /* @__PURE__ */ jsx(Checkout, {
			planId: checkoutDrawer.props.planId,
			planPeriod: checkoutDrawer.props.planPeriod,
			for: checkoutDrawer.props.for,
			seatsQuantity: checkoutDrawer.props.seatsQuantity,
			priceId: checkoutDrawer.props.priceId,
			onSubscriptionComplete: checkoutDrawer.props.onSubscriptionComplete,
			portalRoot: checkoutDrawer.props.portalRoot,
			appearance: checkoutDrawer.props.appearance,
			newSubscriptionRedirectUrl: checkoutDrawer.props.newSubscriptionRedirectUrl
		})
	}, user?.id);
}

//#endregion
export { MountedCheckoutDrawer };
//# sourceMappingURL=MountedCheckoutDrawer.js.map