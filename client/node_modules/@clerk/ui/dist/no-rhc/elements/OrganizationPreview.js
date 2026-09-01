import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, Text } from "../customizables/index.js";
import { useLocalizeCustomRoles } from "../hooks/useFetchRoles.js";
import { OrganizationAvatar } from "./OrganizationAvatar.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/OrganizationPreview.tsx
const OrganizationPreview = (props) => {
	const { organization, size = "md", icon, rounded = false, badge, sx, user, avatarSx, mainIdentifierSx, mainIdentifierVariant, elementId, ...rest } = props;
	const { localizeCustomRole } = useLocalizeCustomRoles();
	const membership = user?.organizationMemberships.find((membership) => membership.organization.id === organization.id);
	const unlocalizedRoleLabel = membership?.roleName;
	const roleLabel = localizeCustomRole(membership?.role) || unlocalizedRoleLabel;
	const mainTextSize = mainIdentifierVariant || {
		xs: "subtitle",
		sm: "caption",
		md: "subtitle",
		lg: "h1"
	}[size];
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.organizationPreview,
		elementId: descriptors.organizationPreview.setId(elementId),
		gap: 4,
		align: "center",
		as: "span",
		sx: [{ minWidth: "0" }, sx],
		...rest,
		children: [/* @__PURE__ */ jsxs(Flex, {
			elementDescriptor: descriptors.organizationPreviewAvatarContainer,
			elementId: descriptors.organizationPreviewAvatarContainer.setId(elementId),
			justify: "center",
			as: "span",
			sx: { position: "relative" },
			children: [/* @__PURE__ */ jsx(OrganizationAvatar, {
				boxElementDescriptor: descriptors.organizationPreviewAvatarBox,
				imageElementDescriptor: descriptors.organizationPreviewAvatarImage,
				...organization,
				size: (t) => ({
					xs: t.sizes.$5,
					sm: t.sizes.$8,
					md: t.sizes.$9,
					lg: t.sizes.$12
				})[size],
				sx: avatarSx,
				rounded
			}), icon && /* @__PURE__ */ jsx(Flex, {
				sx: {
					position: "absolute",
					insetInlineStart: 0,
					bottom: 0
				},
				children: icon
			})]
		}), /* @__PURE__ */ jsxs(Flex, {
			elementDescriptor: descriptors.organizationPreviewTextContainer,
			elementId: descriptors.organizationPreviewTextContainer.setId(elementId),
			direction: "col",
			justify: "center",
			as: "span",
			sx: {
				minWidth: "0px",
				textAlign: "start"
			},
			children: [/* @__PURE__ */ jsxs(Text, {
				elementDescriptor: descriptors.organizationPreviewMainIdentifier,
				elementId: descriptors.organizationPreviewMainIdentifier.setId(elementId),
				variant: mainTextSize,
				as: "span",
				truncate: true,
				sx: mainIdentifierSx,
				title: organization.name,
				children: [
					organization.name,
					" ",
					badge
				]
			}), roleLabel && /* @__PURE__ */ jsx(Text, {
				elementDescriptor: descriptors.organizationPreviewSecondaryIdentifier,
				elementId: descriptors.organizationPreviewSecondaryIdentifier.setId(elementId),
				as: "span",
				localizationKey: roleLabel,
				truncate: true
			})]
		})]
	});
};

//#endregion
export { OrganizationPreview };
//# sourceMappingURL=OrganizationPreview.js.map