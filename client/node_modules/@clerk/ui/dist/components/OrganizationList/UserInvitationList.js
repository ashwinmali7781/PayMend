import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { populateCacheUpdateItem } from "../OrganizationSwitcher/utils.js";
import { PreviewListItem, PreviewListItemButton } from "./shared.js";
import { MembershipPreview } from "./UserMembershipList.js";
import { organizationListParams } from "./utils.js";
import { useState } from "react";
import { useClerk, useOrganizationList } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationList/UserInvitationList.tsx
const AcceptRejectInvitationButtons = (props) => {
	return /* @__PURE__ */ jsx(PreviewListItemButton, {
		isLoading: useCardState().isLoading,
		onClick: props.onAccept,
		localizationKey: localizationKeys("organizationList.action__invitationAccept")
	});
};
const InvitationPreview = withCardStateProvider((props) => {
	const card = useCardState();
	const { getOrganization } = useClerk();
	const [acceptedOrganization, setAcceptedOrganization] = useState(null);
	const { userInvitations } = useOrganizationList({
		userInvitations: organizationListParams.userInvitations,
		userMemberships: organizationListParams.userMemberships
	});
	const handleAccept = () => {
		return card.runAsync(async () => {
			return [await props.accept(), await getOrganization(props.publicOrganizationData.id)];
		}).then(([updatedItem, organization]) => {
			userInvitations?.setData?.((cachedPages) => populateCacheUpdateItem(updatedItem, cachedPages, "negative"));
			setAcceptedOrganization(organization);
		}).catch((err) => handleError(err, [], card.setError));
	};
	if (acceptedOrganization) return /* @__PURE__ */ jsx(MembershipPreview, { organization: acceptedOrganization });
	return /* @__PURE__ */ jsx(PreviewListItem, {
		organizationData: props.publicOrganizationData,
		children: /* @__PURE__ */ jsx(AcceptRejectInvitationButtons, { onAccept: handleAccept })
	});
});

//#endregion
export { InvitationPreview };
//# sourceMappingURL=UserInvitationList.js.map