import { usePaymentMethods, usePlans, usePlansContext, useSubscription } from "../../contexts/components/Plans.js";
import { usePricingTableContext } from "../../contexts/components/PricingTable.js";
import { Flow } from "../../customizables/Flow.js";
import { PricingTableDefault } from "./PricingTableDefault.js";
import { PricingTableMatrix } from "./PricingTableMatrix.js";
import { useEffect, useMemo, useState } from "react";
import { useClerk, usePortalRoot } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/PricingTable/PricingTable.tsx
const PricingTableRoot = (props) => {
	const clerk = useClerk();
	const getContainer = usePortalRoot();
	const { mode = "mounted", signInMode = "redirect", highlightedPlan } = usePricingTableContext();
	const isCompact = mode === "modal";
	const { data: subscription, subscriptionItems } = useSubscription();
	const { data: plans } = usePlans();
	const { handleSelectPlan } = usePlansContext();
	const plansToRender = useMemo(() => {
		return clerk.isSignedIn ? subscription ? plans : [] : plans;
	}, [
		clerk.isSignedIn,
		plans,
		subscription
	]);
	const defaultPlanPeriod = useMemo(() => {
		if (isCompact) {
			const upcomingSubscription = subscriptionItems?.find((sub) => sub.status === "upcoming");
			if (upcomingSubscription) return upcomingSubscription.planPeriod;
			const activeSubscription = subscriptionItems?.find((sub) => !sub.canceledAt && sub.status === "active" && !sub.plan.isDefault);
			if (activeSubscription) return activeSubscription.planPeriod;
		}
		return "annual";
	}, [isCompact, subscriptionItems]);
	const [planPeriod, setPlanPeriod] = useState(defaultPlanPeriod);
	useEffect(() => {
		setPlanPeriod(defaultPlanPeriod);
	}, [defaultPlanPeriod]);
	const selectPlan = (plan, event) => {
		if (!clerk.isSignedIn) {
			if (signInMode === "modal") return clerk.openSignIn({ getContainer });
			return clerk.redirectToSignIn();
		}
		handleSelectPlan({
			mode,
			plan,
			planPeriod,
			event,
			appearance: props.checkoutProps?.appearance,
			newSubscriptionRedirectUrl: props.newSubscriptionRedirectUrl
		});
	};
	usePaymentMethods();
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "pricingTable",
		isFlowReady: clerk.isSignedIn ? !!subscription : plans.length > 0,
		sx: { width: "100%" },
		children: mode !== "modal" && props.layout === "matrix" ? /* @__PURE__ */ jsx(PricingTableMatrix, {
			plans: plansToRender,
			planPeriod,
			setPlanPeriod,
			onSelect: selectPlan,
			highlightedPlan
		}) : /* @__PURE__ */ jsx(PricingTableDefault, {
			plans: plansToRender,
			highlightedPlan,
			planPeriod,
			setPlanPeriod,
			onSelect: selectPlan,
			isCompact,
			props
		})
	});
};
const PricingTableModal = (props) => {
	return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(PricingTableRoot, { ...props }) });
};
const PricingTable = (props) => {
	const { mode = "mounted" } = usePricingTableContext();
	return mode === "modal" ? /* @__PURE__ */ jsx(PricingTableModal, { ...props }) : /* @__PURE__ */ jsx(PricingTableRoot, { ...props });
};

//#endregion
export { PricingTable };
//# sourceMappingURL=PricingTable.js.map