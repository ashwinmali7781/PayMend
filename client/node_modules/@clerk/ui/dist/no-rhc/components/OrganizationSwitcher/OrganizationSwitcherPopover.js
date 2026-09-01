import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgCog from "../../icons/cog.js";
import { withProtect } from "../../common/Gate.js";
import { useOrganizationSwitcherContext } from "../../contexts/components/OrganizationSwitcher.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Flex } from "../../customizables/index.js";
import { NotificationCountBadge } from "../../common/NotificationCountBadge.js";
import { Actions, SmallAction } from "../../elements/Actions.js";
import { OrganizationPreview } from "../../elements/OrganizationPreview.js";
import { PersonalWorkspacePreview } from "../../elements/PersonalWorkspacePreview.js";
import { PopoverCard } from "../../elements/PopoverCard.js";
import { RootBox } from "../../elements/RootBox.js";
import { OrganizationActionList } from "./OtherOrganizationActions.js";
import React from "react";
import { useClerk, useOrganization, useOrganizationList, usePortalRoot, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationSwitcher/OrganizationSwitcherPopover.tsx
const OrganizationSwitcherPopover = React.forwardRef((props, ref) => {
	const { close: unsafeClose, ...rest } = props;
	const close = () => unsafeClose?.(false);
	const card = useCardState();
	const { __experimental_asStandalone } = useOrganizationSwitcherContext();
	const { openOrganizationProfile, openCreateOrganization } = useClerk();
	const getContainer = usePortalRoot();
	const { organization: currentOrg } = useOrganization();
	const { isLoaded, setActive } = useOrganizationList();
	const { hidePersonal, createOrganizationMode, organizationProfileMode, afterLeaveOrganizationUrl, afterCreateOrganizationUrl, navigateCreateOrganization, navigateOrganizationProfile, afterSelectOrganizationUrl, afterSelectPersonalUrl, organizationProfileProps, skipInvitationScreen } = useOrganizationSwitcherContext();
	const { user } = useUser();
	if (!user) return null;
	const { primaryEmailAddress, primaryPhoneNumber, primaryWeb3Wallet, username, ...userWithoutIdentifiers } = user;
	if (!isLoaded) return null;
	const handleOrganizationClicked = (organization) => {
		return card.runAsync(() => setActive({
			organization,
			redirectUrl: afterSelectOrganizationUrl(organization)
		})).then(close);
	};
	const handlePersonalWorkspaceClicked = () => {
		return card.runAsync(() => setActive({
			organization: null,
			redirectUrl: afterSelectPersonalUrl(user)
		})).then(close);
	};
	const handleCreateOrganizationClicked = () => {
		close();
		if (createOrganizationMode === "navigation") return navigateCreateOrganization();
		return openCreateOrganization({
			afterCreateOrganizationUrl,
			skipInvitationScreen,
			getContainer
		});
	};
	const handleItemClick = () => {
		close();
		if (organizationProfileMode === "navigation") return navigateOrganizationProfile();
		return openOrganizationProfile({
			...organizationProfileProps,
			afterLeaveOrganizationUrl,
			getContainer
		});
	};
	const manageOrganizationButton = /* @__PURE__ */ jsx(SmallAction, {
		elementDescriptor: descriptors.organizationSwitcherPopoverActionButton,
		elementId: descriptors.organizationSwitcherPopoverActionButton.setId("manageOrganization"),
		iconBoxElementDescriptor: descriptors.organizationSwitcherPopoverActionButtonIconBox,
		iconBoxElementId: descriptors.organizationSwitcherPopoverActionButtonIconBox.setId("manageOrganization"),
		iconElementDescriptor: descriptors.organizationSwitcherPopoverActionButtonIcon,
		iconElementId: descriptors.organizationSwitcherPopoverActionButtonIcon.setId("manageOrganization"),
		icon: SvgCog,
		label: localizationKeys("organizationSwitcher.action__manageOrganization"),
		onClick: () => handleItemClick(),
		trailing: /* @__PURE__ */ jsx(NotificationCountBadgeManageButton, {}),
		focusRing: true
	});
	const selectedOrganizationPreview = (currentOrg) => /* @__PURE__ */ jsxs(Flex, {
		justify: "between",
		align: "center",
		sx: (t) => ({
			width: "100%",
			paddingInlineEnd: t.space.$5
		}),
		children: [/* @__PURE__ */ jsx(OrganizationPreview, {
			elementId: "organizationSwitcherActiveOrganization",
			organization: currentOrg,
			user,
			mainIdentifierVariant: "buttonLarge",
			sx: (t) => ({ padding: `${t.space.$4} ${t.space.$5}` })
		}), /* @__PURE__ */ jsx(Actions, { children: manageOrganizationButton })]
	});
	return /* @__PURE__ */ jsx(RootBox, {
		elementDescriptor: descriptors.organizationSwitcherPopoverRootBox,
		children: /* @__PURE__ */ jsxs(PopoverCard.Root, {
			elementDescriptor: descriptors.organizationSwitcherPopoverCard,
			ref,
			role: "dialog",
			"aria-label": `${currentOrg?.name} is active`,
			shouldEntryAnimate: !__experimental_asStandalone,
			...rest,
			children: [/* @__PURE__ */ jsx(PopoverCard.Content, {
				elementDescriptor: descriptors.organizationSwitcherPopoverMain,
				children: /* @__PURE__ */ jsxs(Actions, {
					elementDescriptor: descriptors.organizationSwitcherPopoverActions,
					children: [currentOrg ? selectedOrganizationPreview(currentOrg) : !hidePersonal && /* @__PURE__ */ jsx(PersonalWorkspacePreview, {
						user: userWithoutIdentifiers,
						sx: (t) => ({
							padding: `${t.space.$4} ${t.space.$5}`,
							width: "100%"
						}),
						title: localizationKeys("organizationSwitcher.personalWorkspace")
					}), /* @__PURE__ */ jsx(OrganizationActionList, {
						onCreateOrganizationClick: handleCreateOrganizationClicked,
						onPersonalWorkspaceClick: handlePersonalWorkspaceClicked,
						onOrganizationClick: handleOrganizationClicked
					})]
				})
			}), /* @__PURE__ */ jsx(PopoverCard.Footer, { elementDescriptor: descriptors.organizationSwitcherPopoverFooter })]
		})
	});
});
const NotificationCountBadgeManageButton = withProtect(({ sx }) => {
	const { organizationSettings } = useEnvironment();
	const isDomainsEnabled = organizationSettings?.domains?.enabled;
	const { membershipRequests } = useOrganization({ membershipRequests: isDomainsEnabled || void 0 });
	if (!membershipRequests?.count) return null;
	return /* @__PURE__ */ jsx(NotificationCountBadge, {
		notificationCount: membershipRequests.count,
		containerSx: sx
	});
}, { permission: "org:sys_memberships:manage" });

//#endregion
export { OrganizationSwitcherPopover };
//# sourceMappingURL=OrganizationSwitcherPopover.js.map