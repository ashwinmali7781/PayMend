import { localizationKeys } from "../../localization/localizationKeys.js";
import { Badge } from "../../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/Subscriptions/badge.tsx
const keys = {
	active: "badge__activePlan",
	upcoming: "badge__upcomingPlan",
	past_due: "badge__pastDuePlan",
	free_trial: "badge__freeTrial"
};
const colors = {
	active: "secondary",
	upcoming: "primary",
	past_due: "warning",
	free_trial: "secondary"
};
const SubscriptionBadge = ({ subscription, elementDescriptor }) => {
	return /* @__PURE__ */ jsx(Badge, {
		elementDescriptor,
		colorScheme: colors[subscription.status],
		localizationKey: localizationKeys(keys[subscription.status])
	});
};

//#endregion
export { SubscriptionBadge };
//# sourceMappingURL=badge.js.map