import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgChevronDown from "../../icons/chevron-down.js";
import { useProtect } from "../../common/Gate.js";
import { useOrganizationSwitcherContext } from "../../contexts/components/OrganizationSwitcher.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Button, Icon } from "../../customizables/index.js";
import { NotificationCountBadge } from "../../common/NotificationCountBadge.js";
import { organizationListParams } from "./utils.js";
import { OrganizationPreview } from "../../elements/OrganizationPreview.js";
import { PersonalWorkspacePreview } from "../../elements/PersonalWorkspacePreview.js";
import { withAvatarShimmer } from "../../elements/withAvatarShimmer.js";
import { forwardRef } from "react";
import { useOrganization, useOrganizationList, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationSwitcher/OrganizationSwitcherTrigger.tsx
const OrganizationSwitcherTrigger = withAvatarShimmer(forwardRef((props, ref) => {
	const { sx, ...rest } = props;
	const { user } = useUser();
	const { organization } = useOrganization();
	const { hidePersonal } = useOrganizationSwitcherContext();
	const { t } = useLocalizations();
	if (!user) return null;
	const { primaryEmailAddress, primaryPhoneNumber, primaryWeb3Wallet, username, ...userWithoutIdentifiers } = user;
	return /* @__PURE__ */ jsxs(Button, {
		elementDescriptor: descriptors.organizationSwitcherTrigger,
		elementId: descriptors.organizationSwitcherTrigger.setId(organization ? "organization" : "personal"),
		variant: "ghost",
		colorScheme: "neutral",
		hoverAsFocus: true,
		focusRing: false,
		sx: [(t) => ({
			padding: `${t.space.$1} ${t.space.$2} ${t.space.$1} ${t.space.$1}`,
			position: "relative",
			"&[aria-expanded=\"true\"]": {
				backgroundColor: "var(--alpha)",
				color: "var(--accentHover)"
			}
		}), sx],
		ref,
		"aria-label": `${props.isOpen ? t(localizationKeys("organizationSwitcher.action__closeOrganizationSwitcher")) : t(localizationKeys("organizationSwitcher.action__openOrganizationSwitcher"))}`,
		"aria-expanded": props.isOpen,
		"aria-haspopup": "dialog",
		...rest,
		children: [
			organization && /* @__PURE__ */ jsx(OrganizationPreview, {
				elementId: "organizationSwitcherTrigger",
				gap: 3,
				size: "xs",
				organization,
				avatarSx: (t) => ({ borderRadius: t.radii.$sm }),
				sx: { maxWidth: "30ch" }
			}),
			!organization && /* @__PURE__ */ jsx(PersonalWorkspacePreview, {
				size: "xs",
				gap: 3,
				user: userWithoutIdentifiers,
				showAvatar: !hidePersonal,
				sx: (t) => ({ color: t.colors.$colorMutedForeground }),
				title: hidePersonal ? localizationKeys("organizationSwitcher.notSelected") : localizationKeys("organizationSwitcher.personalWorkspace")
			}),
			/* @__PURE__ */ jsx(NotificationCountBadgeSwitcherTrigger, {}),
			/* @__PURE__ */ jsx(Icon, {
				elementDescriptor: descriptors.organizationSwitcherTriggerIcon,
				icon: SvgChevronDown,
				sx: (t) => ({ marginInlineStart: `${t.space.$2}` })
			})
		]
	});
}));
const NotificationCountBadgeSwitcherTrigger = () => {
	/**
	* Prefetch user invitations and suggestions
	*/
	const { userInvitations, userSuggestions } = useOrganizationList(organizationListParams);
	const { organizationSettings } = useEnvironment();
	const canAcceptRequests = useProtect({ permission: "org:sys_memberships:manage" });
	const isDomainsEnabled = organizationSettings?.domains?.enabled;
	const { membershipRequests } = useOrganization({ membershipRequests: isDomainsEnabled && canAcceptRequests || void 0 });
	const notificationCount = (userInvitations.count || 0) + (userSuggestions.count || 0) + (membershipRequests?.count || 0);
	if (!notificationCount) return null;
	return /* @__PURE__ */ jsx(NotificationCountBadge, {
		containerSx: (t) => ({
			position: "absolute",
			top: `calc(${t.space.$2} * -1)`,
			insetInlineEnd: `calc(${t.space.$2} * -1)`
		}),
		notificationCount
	});
};

//#endregion
export { OrganizationSwitcherTrigger };
//# sourceMappingURL=OrganizationSwitcherTrigger.js.map