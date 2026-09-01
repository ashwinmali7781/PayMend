import { localizationKeys } from "../../localization/localizationKeys.js";
import { useOrganizationListContext } from "../../contexts/components/OrganizationList.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { OrganizationPreview } from "../../elements/OrganizationPreview.js";
import { sharedMainIdentifierSx } from "../../common/organizations/OrganizationPreview.js";
import { OrganizationListPreviewButton } from "./shared.js";
import { PersonalWorkspacePreview } from "../../elements/PersonalWorkspacePreview.js";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import { useOrganizationList, useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationList/UserMembershipList.tsx
const MembershipPreview = (props) => {
	const { user } = useUser();
	const card = useCardState();
	const { navigateAfterSelectOrganization } = useOrganizationListContext();
	const { t } = useLocalizations();
	const { isLoaded, setActive } = useOrganizationList();
	if (!isLoaded) return null;
	const handleOrganizationClicked = (organization) => {
		return card.runAsync(async () => {
			try {
				await setActive({ organization });
				await navigateAfterSelectOrganization(organization);
			} catch (err) {
				if (!isClerkAPIResponseError(err)) {
					handleError(err, [], card.setError);
					return;
				}
				switch (err.errors?.[0]?.code) {
					case "organization_not_found_or_unauthorized":
					case "not_a_member_in_organization":
						if (user?.createOrganizationEnabled) card.setError(t(localizationKeys("unstable__errors.organization_not_found_or_unauthorized")));
						else card.setError(t(localizationKeys("unstable__errors.organization_not_found_or_unauthorized_with_create_organization_disabled")));
						break;
					default: handleError(err, [], card.setError);
				}
			}
		});
	};
	return /* @__PURE__ */ jsx(OrganizationListPreviewButton, {
		onClick: () => handleOrganizationClicked(props.organization),
		children: /* @__PURE__ */ jsx(OrganizationPreview, {
			elementId: "organizationList",
			mainIdentifierSx: sharedMainIdentifierSx,
			organization: props.organization
		})
	});
};
const PersonalAccountPreview = withCardStateProvider(() => {
	const card = useCardState();
	const { hidePersonal, navigateAfterSelectPersonal } = useOrganizationListContext();
	const { isLoaded, setActive } = useOrganizationList();
	const { user } = useUser();
	if (!user) return null;
	const { primaryEmailAddress, primaryPhoneNumber, primaryWeb3Wallet, username, ...userWithoutIdentifiers } = user;
	const handlePersonalClicked = () => {
		if (!isLoaded) return;
		return card.runAsync(async () => {
			await setActive({ organization: null });
			await navigateAfterSelectPersonal(user);
		});
	};
	if (hidePersonal) return null;
	return /* @__PURE__ */ jsx(OrganizationListPreviewButton, {
		onClick: handlePersonalClicked,
		children: /* @__PURE__ */ jsx(PersonalWorkspacePreview, {
			user: userWithoutIdentifiers,
			mainIdentifierSx: sharedMainIdentifierSx,
			title: localizationKeys("organizationSwitcher.personalWorkspace")
		})
	});
});

//#endregion
export { MembershipPreview, PersonalAccountPreview };
//# sourceMappingURL=UserMembershipList.js.map