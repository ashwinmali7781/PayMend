import { LazyDrawerRenderer } from "./providers.js";
import { SubscriptionDetails } from "../components/SubscriptionDetails/index.js";
import { useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/lazyModules/MountedSubscriptionDetailDrawer.tsx
function MountedSubscriptionDetailDrawer({ appearance, subscriptionDetailsDrawer, onOpenChange }) {
	const { user } = useUser();
	if (!subscriptionDetailsDrawer.props) return null;
	return /* @__PURE__ */ jsx(LazyDrawerRenderer, {
		globalAppearance: appearance,
		appearanceKey: "subscriptionDetails",
		componentAppearance: subscriptionDetailsDrawer.props.appearance || {},
		flowName: "subscriptionDetails",
		open: subscriptionDetailsDrawer.open,
		onOpenChange,
		componentName: "SubscriptionDetails",
		portalId: subscriptionDetailsDrawer.props.portalId,
		portalRoot: subscriptionDetailsDrawer.props.portalRoot,
		children: /* @__PURE__ */ jsx(SubscriptionDetails, { ...subscriptionDetailsDrawer.props })
	}, user?.id);
}

//#endregion
export { MountedSubscriptionDetailDrawer };
//# sourceMappingURL=MountedSubscriptionDetailDrawer.js.map