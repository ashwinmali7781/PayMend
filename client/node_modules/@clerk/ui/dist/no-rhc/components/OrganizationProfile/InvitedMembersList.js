import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Box, Td, Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { ThreeDotsMenu } from "../../elements/ThreeDotsMenu.js";
import { useFetchRoles, useLocalizeCustomRoles } from "../../hooks/useFetchRoles.js";
import { DataTable, RowContainer } from "./MemberListTable.js";
import { UserPreview } from "../../elements/UserPreview.js";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/InvitedMembersList.tsx
const invitationsParams = { invitations: {
	pageSize: 10,
	keepPreviousData: true
} };
const InvitedMembersList = () => {
	const card = useCardState();
	const { organization, invitations } = useOrganization(invitationsParams);
	const { options, isLoading: loadingRoles } = useFetchRoles();
	if (!organization) return null;
	const revoke = (invitation) => async () => {
		return card.runAsync(async () => {
			await invitation.revoke();
			await invitations?.revalidate?.();
			return invitation;
		}).catch((err) => handleError(err, [], card.setError));
	};
	return /* @__PURE__ */ jsx(DataTable, {
		page: invitations?.page || 1,
		onPageChange: invitations?.fetchPage || (() => null),
		itemCount: invitations?.count || 0,
		pageCount: invitations?.pageCount || 0,
		itemsPerPage: invitationsParams.invitations.pageSize,
		isLoading: invitations?.isLoading || loadingRoles,
		emptyStateLocalizationKey: localizationKeys("organizationProfile.membersPage.invitationsTab.table__emptyRow"),
		headers: [
			{ key: localizationKeys("organizationProfile.membersPage.activeMembersTab.tableHeader__user") },
			{ key: localizationKeys("organizationProfile.membersPage.invitedMembersTab.tableHeader__invited") },
			{ key: localizationKeys("organizationProfile.membersPage.activeMembersTab.tableHeader__role") },
			{
				key: localizationKeys("organizationProfile.membersPage.activeMembersTab.tableHeader__actions"),
				align: "right"
			}
		],
		rows: (invitations?.data || []).map((i) => /* @__PURE__ */ jsx(InvitationRow, {
			options,
			invitation: i,
			onRevoke: revoke(i)
		}, i.id))
	});
};
const InvitationRow = (props) => {
	const { invitation, onRevoke, options } = props;
	const { localizeCustomRole } = useLocalizeCustomRoles();
	const unlocalizedRoleLabel = options?.find((a) => a.value === invitation.role)?.label;
	return /* @__PURE__ */ jsxs(RowContainer, { children: [
		/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(UserPreview, {
			sx: { maxWidth: "30ch" },
			user: { primaryEmailAddress: { emailAddress: invitation.emailAddress } },
			subtitleProps: { variant: "caption" }
		}) }),
		/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Box, {
			as: "span",
			elementDescriptor: descriptors.formattedDate,
			elementId: descriptors.formattedDate.setId("tableCell"),
			children: invitation.createdAt.toLocaleDateString()
		}) }),
		/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Text, {
			colorScheme: "secondary",
			localizationKey: localizeCustomRole(invitation.role) || unlocalizedRoleLabel
		}) }),
		/* @__PURE__ */ jsx(Td, {
			sx: { textAlign: "end" },
			children: /* @__PURE__ */ jsx(ThreeDotsMenu, {
				actions: [{
					label: localizationKeys("organizationProfile.membersPage.invitedMembersTab.menuAction__revoke"),
					isDestructive: true,
					onClick: onRevoke
				}],
				elementId: "invitation"
			})
		})
	] });
};

//#endregion
export { InvitedMembersList };
//# sourceMappingURL=InvitedMembersList.js.map