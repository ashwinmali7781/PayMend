import { localizationKeys } from "../../localization/localizationKeys.js";
import { useProtect } from "../../common/Gate.js";
import { isPlanWithPerSeatCosts } from "../../utils/billingPlanSeats.js";
import { useSubscription } from "../../contexts/components/Plans.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Button, Flex } from "../../customizables/index.js";
import { Animated } from "../../elements/Animated.js";
import { Action } from "../../elements/Action/index.js";
import { Tooltip } from "../../elements/Tooltip.js";
import { InviteMembersScreen } from "./InviteMembersScreen.js";
import { useMemo } from "react";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/MembersActions.tsx
const MembersActionsRow = ({ actionSlot }) => {
	const canManageMemberships = useProtect({ permission: "org:sys_memberships:manage" });
	const { organization } = useOrganization();
	const { subscriptionItems } = useSubscription();
	const isBelowLimit = useMemo(() => {
		if (!organization) return false;
		if (subscriptionItems.length > 0 && isPlanWithPerSeatCosts(subscriptionItems[0].plan)) return true;
		if (organization.maxAllowedMemberships === 0) return true;
		return organization.membersCount + organization.pendingInvitationsCount < organization.maxAllowedMemberships;
	}, [organization, subscriptionItems]);
	const inviteButton = /* @__PURE__ */ jsx(Button, {
		elementDescriptor: descriptors.membersPageInviteButton,
		"aria-label": "Invite",
		localizationKey: localizationKeys("organizationProfile.membersPage.action__invite"),
		isDisabled: !isBelowLimit
	});
	let wrappedInviteButton;
	if (isBelowLimit) wrappedInviteButton = /* @__PURE__ */ jsx(Action.Trigger, {
		value: "invite",
		hideOnActive: !actionSlot,
		children: inviteButton
	});
	else wrappedInviteButton = /* @__PURE__ */ jsxs(Tooltip.Root, { children: [/* @__PURE__ */ jsx(Tooltip.Trigger, { children: inviteButton }), /* @__PURE__ */ jsx(Tooltip.Content, { text: localizationKeys("unstable__errors.organization_membership_quota_exceeded") })] });
	return /* @__PURE__ */ jsxs(Action.Root, {
		animate: false,
		children: [/* @__PURE__ */ jsx(Animated, {
			asChild: true,
			children: /* @__PURE__ */ jsxs(Flex, {
				justify: actionSlot ? "between" : "end",
				sx: (t) => ({
					width: "100%",
					marginInlineStart: "auto",
					padding: `${t.space.$none} ${t.space.$1}`
				}),
				gap: actionSlot ? 2 : void 0,
				children: [actionSlot, canManageMemberships && wrappedInviteButton]
			})
		}), canManageMemberships && /* @__PURE__ */ jsx(Animated, { children: /* @__PURE__ */ jsx(Action.Open, {
			value: "invite",
			children: /* @__PURE__ */ jsx(Flex, {
				sx: (t) => ({
					paddingBottom: t.space.$6,
					padding: `${t.space.$none} ${t.space.$1} ${t.space.$6} ${t.space.$1}`
				}),
				children: /* @__PURE__ */ jsx(Action.Card, {
					sx: { width: "100%" },
					children: /* @__PURE__ */ jsx(InviteMembersScreen, {})
				})
			})
		}) })]
	});
};

//#endregion
export { MembersActionsRow };
//# sourceMappingURL=MembersActions.js.map