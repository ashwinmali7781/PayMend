import { PlanDetails } from "./components.js";
import { LazyDrawerRenderer } from "./providers.js";
import { useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/lazyModules/MountedPlanDetailDrawer.tsx
function MountedPlanDetailDrawer({ appearance, planDetailsDrawer, onOpenChange }) {
	const { user } = useUser();
	if (!planDetailsDrawer.props) return null;
	return /* @__PURE__ */ jsx(LazyDrawerRenderer, {
		globalAppearance: appearance,
		appearanceKey: "planDetails",
		componentAppearance: planDetailsDrawer.props.appearance || {},
		flowName: "planDetails",
		open: planDetailsDrawer.open,
		onOpenChange,
		componentName: "PlanDetails",
		portalId: planDetailsDrawer.props.portalId,
		portalRoot: planDetailsDrawer.props.portalRoot,
		children: /* @__PURE__ */ jsx(PlanDetails, { ...planDetailsDrawer.props })
	}, user?.id);
}

//#endregion
export { MountedPlanDetailDrawer };
//# sourceMappingURL=MountedPlanDetailDrawer.js.map