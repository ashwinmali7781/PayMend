import { localizationKeys } from "../../localization/localizationKeys.js";
import { Protect } from "../../common/Gate.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Badge, Box, Td, Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { ThreeDotsMenu } from "../../elements/ThreeDotsMenu.js";
import { useFetchRoles, useLocalizeCustomRoles } from "../../hooks/useFetchRoles.js";
import { DataTable, RoleSelect, RowContainer } from "./MemberListTable.js";
import { UserPreview } from "../../elements/UserPreview.js";
import { useOrganization, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/ActiveMembersList.tsx
const ActiveMembersList = ({ memberships, pageSize }) => {
	const card = useCardState();
	const { organization } = useOrganization();
	const { options, isLoading: loadingRoles, hasRoleSetMigration } = useFetchRoles();
	if (!organization) return null;
	const handleRoleChange = (membership) => (newRole) => card.runAsync(() => membership.update({ role: newRole })).catch((err) => handleError(err, [], card.setError));
	const handleRemove = (membership) => async () => {
		return card.runAsync(async () => {
			const destroyedMembership = await membership.destroy();
			await memberships?.revalidate?.();
			return destroyedMembership;
		}).catch((err) => handleError(err, [], card.setError));
	};
	return /* @__PURE__ */ jsx(DataTable, {
		page: memberships?.page || 1,
		onPageChange: (n) => memberships?.fetchPage?.(n),
		itemCount: memberships?.count || 0,
		pageCount: memberships?.pageCount || 0,
		itemsPerPage: pageSize,
		isLoading: memberships?.isLoading && !memberships?.data.length || loadingRoles,
		emptyStateLocalizationKey: localizationKeys("organizationProfile.membersPage.detailsTitle__emptyRow"),
		headers: [
			{ key: localizationKeys("organizationProfile.membersPage.activeMembersTab.tableHeader__user") },
			{ key: localizationKeys("organizationProfile.membersPage.activeMembersTab.tableHeader__joined") },
			{ key: localizationKeys("organizationProfile.membersPage.activeMembersTab.tableHeader__role") },
			{
				key: localizationKeys("organizationProfile.membersPage.activeMembersTab.tableHeader__actions"),
				align: "right"
			}
		],
		rows: (memberships?.data || []).map((m) => /* @__PURE__ */ jsx(MemberRow, {
			membership: m,
			options,
			onRoleChange: handleRoleChange(m),
			onRemove: handleRemove(m),
			hasRoleSetMigration
		}, m.id))
	});
};
const MemberRow = (props) => {
	const { membership, onRemove, onRoleChange, options, hasRoleSetMigration } = props;
	const { localizeCustomRole } = useLocalizeCustomRoles();
	const card = useCardState();
	const { user } = useUser();
	const isCurrentUser = user?.id === membership.publicUserData?.userId;
	const isDeprovisioned = membership.publicUserData?.deprovisioned;
	const unlocalizedRoleLabel = options?.find((a) => a.value === membership.role)?.label;
	return /* @__PURE__ */ jsxs(RowContainer, {
		isDisabled: isDeprovisioned,
		children: [
			/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(UserPreview, {
				sx: { maxWidth: "30ch" },
				user: membership.publicUserData,
				subtitle: membership.publicUserData?.identifier,
				subtitleProps: { variant: "caption" },
				badge: isCurrentUser ? /* @__PURE__ */ jsx(Badge, { localizationKey: localizationKeys("badge__you") }) : isDeprovisioned ? /* @__PURE__ */ jsx(Badge, {
					colorScheme: "secondary",
					localizationKey: localizationKeys("badge__deprovisioned")
				}) : membership.publicUserData?.banned ? /* @__PURE__ */ jsx(Badge, {
					colorScheme: "danger",
					localizationKey: localizationKeys("badge__banned")
				}) : void 0
			}) }),
			/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Box, {
				as: "span",
				elementDescriptor: descriptors.formattedDate,
				elementId: descriptors.formattedDate.setId("tableCell"),
				children: membership.createdAt.toLocaleDateString()
			}) }),
			/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Protect, {
				permission: "org:sys_memberships:manage",
				fallback: /* @__PURE__ */ jsx(Text, {
					sx: (t) => ({ opacity: t.opacity.$inactive }),
					children: localizeCustomRole(membership.role) || unlocalizedRoleLabel
				}),
				children: /* @__PURE__ */ jsx(RoleSelect, {
					isDisabled: card.isLoading || !onRoleChange || hasRoleSetMigration || isDeprovisioned,
					value: membership.role,
					fallbackLabel: membership.roleName,
					onChange: onRoleChange,
					roles: options
				})
			}) }),
			/* @__PURE__ */ jsx(Td, {
				sx: { textAlign: "end" },
				children: /* @__PURE__ */ jsx(Protect, {
					permission: "org:sys_memberships:manage",
					children: /* @__PURE__ */ jsx(ThreeDotsMenu, {
						actions: [{
							label: localizationKeys("organizationProfile.membersPage.activeMembersTab.menuAction__remove"),
							isDestructive: true,
							onClick: onRemove,
							isDisabled: isCurrentUser || isDeprovisioned
						}],
						elementId: "member"
					})
				})
			})
		]
	});
};

//#endregion
export { ActiveMembersList };
//# sourceMappingURL=ActiveMembersList.js.map