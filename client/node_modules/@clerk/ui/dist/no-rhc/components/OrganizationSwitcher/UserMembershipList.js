import { useInView } from "../../hooks/useInView.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgArrowRight from "../../icons/arrow-right.js";
import { useOrganizationSwitcherContext } from "../../contexts/components/OrganizationSwitcher.js";
import { common } from "../../styledSystem/common.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box } from "../../customizables/index.js";
import { InfiniteListSpinner } from "../../common/InfiniteListSpinner.js";
import { organizationListParams } from "./utils.js";
import { OrganizationPreview } from "../../elements/OrganizationPreview.js";
import { PreviewButton } from "../../elements/PreviewButton.js";
import { PersonalWorkspacePreview } from "../../elements/PersonalWorkspacePreview.js";
import React from "react";
import { useOrganization, useOrganizationList, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationSwitcher/UserMembershipList.tsx
const useFetchMemberships = () => {
	const { userMemberships } = useOrganizationList({ userMemberships: organizationListParams.userMemberships });
	const { ref } = useInView({
		threshold: 0,
		onChange: (inView) => {
			if (!inView) return;
			if (userMemberships.hasNextPage) userMemberships.fetchNext?.();
		}
	});
	return {
		userMemberships,
		ref
	};
};
const UserMembershipList = (props) => {
	const { onPersonalWorkspaceClick, onOrganizationClick } = props;
	const { hidePersonal } = useOrganizationSwitcherContext();
	const { organization: currentOrg } = useOrganization();
	const { ref, userMemberships } = useFetchMemberships();
	const { user } = useUser();
	const otherOrgs = ((userMemberships.count || 0) > 0 ? userMemberships.data || [] : []).map((e) => e.organization).filter((o) => o.id !== currentOrg?.id);
	if (!user) return null;
	const { primaryEmailAddress, primaryPhoneNumber, primaryWeb3Wallet, username, ...userWithoutIdentifiers } = user;
	const { isLoading, hasNextPage } = userMemberships;
	return /* @__PURE__ */ jsxs(Box, {
		sx: (t) => ({
			maxHeight: `calc((4 * ${t.sizes.$17}) + 4px)`,
			overflowY: "auto",
			"> button,div": { border: `0 solid ${t.colors.$borderAlpha100}` },
			">:not([hidden])~:not([hidden])": {
				borderTopWidth: "1px",
				borderBottomWidth: "0"
			},
			...common.unstyledScrollbar(t)
		}),
		role: "group",
		"aria-label": hidePersonal ? "List of all organization memberships" : "List of all accounts",
		children: [
			currentOrg && !hidePersonal && /* @__PURE__ */ jsx(PreviewButton, {
				elementDescriptor: descriptors.organizationSwitcherPreviewButton,
				elementId: descriptors.organizationSwitcherPreviewButton.setId("personal"),
				icon: SvgArrowRight,
				onClick: onPersonalWorkspaceClick,
				children: /* @__PURE__ */ jsx(PersonalWorkspacePreview, {
					user: userWithoutIdentifiers,
					mainIdentifierVariant: "buttonLarge",
					title: localizationKeys("organizationSwitcher.personalWorkspace")
				})
			}),
			otherOrgs.map((organization) => /* @__PURE__ */ jsx(PreviewButton, {
				elementDescriptor: descriptors.organizationSwitcherPreviewButton,
				elementId: descriptors.organizationSwitcherPreviewButton.setId("organization"),
				icon: SvgArrowRight,
				onClick: () => onOrganizationClick(organization),
				sx: (t) => ({ border: `0 solid ${t.colors.$borderAlpha100}` }),
				children: /* @__PURE__ */ jsx(OrganizationPreview, {
					elementId: "organizationSwitcherListedOrganization",
					organization
				})
			}, organization.id)),
			(hasNextPage || isLoading) && /* @__PURE__ */ jsx(InfiniteListSpinner, { ref })
		]
	});
};

//#endregion
export { UserMembershipList };
//# sourceMappingURL=UserMembershipList.js.map