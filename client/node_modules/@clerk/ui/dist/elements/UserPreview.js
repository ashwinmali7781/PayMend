import { useLocalizations } from "../localization/makeLocalizable.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, Text } from "../customizables/index.js";
import { UserAvatar } from "./UserAvatar.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { getFullName, getIdentifier } from "@clerk/shared/internal/clerk-js/user";

//#region src/elements/UserPreview.tsx
const UserPreview = (props) => {
	const { user, externalAccount, enterpriseAccount, size = "md", showAvatar = true, icon, iconSx, rounded = true, imageUrl: imageUrlProp, badge, elementId, sx, title, subtitle, avatarSx, mainIdentifierSx, mainIdentifierVariant, subtitleProps, ...rest } = props;
	const { t } = useLocalizations();
	const name = getFullName({ ...user }) || getFullName({ ...externalAccount }) || getFullName({ ...enterpriseAccount });
	const identifier = getIdentifier({ ...user }) || externalAccount?.accountIdentifier?.() || enterpriseAccount?.emailAddress;
	const localizedTitle = t(title);
	const imageUrl = imageUrlProp || user?.imageUrl || externalAccount?.imageUrl;
	const getAvatarSizes = (t) => ({
		xs: t.sizes.$5,
		sm: t.sizes.$8,
		md: t.sizes.$9,
		lg: t.sizes.$12
	})[size];
	const mainIdentifierSize = mainIdentifierVariant || {
		xs: "subtitle",
		sm: "caption",
		md: "subtitle",
		lg: "h1"
	}[size];
	const previewTitle = localizedTitle || name || identifier;
	return /* @__PURE__ */ jsxs(Flex, {
		elementDescriptor: descriptors.userPreview,
		elementId: descriptors.userPreview.setId(elementId),
		align: "center",
		as: "span",
		sx: [(t) => ({
			minWidth: "0px",
			width: "fit-content",
			gap: t.space.$4,
			minHeight: imageUrl && !showAvatar ? getAvatarSizes(t) : void 0
		}), sx],
		...rest,
		children: [imageUrl ? showAvatar ? /* @__PURE__ */ jsxs(Flex, {
			elementDescriptor: descriptors.userPreviewAvatarContainer,
			elementId: descriptors.userPreviewAvatarContainer.setId(elementId),
			justify: "center",
			as: "span",
			sx: { position: "relative" },
			children: [/* @__PURE__ */ jsx(UserAvatar, {
				boxElementDescriptor: descriptors.userPreviewAvatarBox,
				imageElementDescriptor: descriptors.userPreviewAvatarImage,
				...user,
				...externalAccount,
				...enterpriseAccount,
				name,
				avatarUrl: imageUrl,
				size: getAvatarSizes,
				sx: avatarSx,
				rounded
			}), icon && /* @__PURE__ */ jsx(Flex, {
				elementDescriptor: descriptors.userPreviewAvatarIcon,
				sx: [{
					position: "absolute",
					insetInlineStart: 0,
					bottom: 0
				}, iconSx],
				as: "span",
				children: icon
			})]
		}) : null : null, /* @__PURE__ */ jsxs(Flex, {
			elementDescriptor: descriptors.userPreviewTextContainer,
			elementId: descriptors.userPreviewTextContainer.setId(elementId),
			direction: "col",
			justify: "center",
			as: "span",
			sx: {
				minWidth: "0px",
				textAlign: "start"
			},
			children: [/* @__PURE__ */ jsxs(Text, {
				elementDescriptor: descriptors.userPreviewMainIdentifier,
				elementId: descriptors.userPreviewMainIdentifier.setId(elementId),
				variant: mainIdentifierSize,
				as: "span",
				sx: [(theme) => ({
					display: "flex",
					gap: theme.sizes.$1,
					alignItems: "center"
				}), mainIdentifierSx],
				children: [previewTitle && /* @__PURE__ */ jsx(Text, {
					elementDescriptor: descriptors.userPreviewMainIdentifierText,
					elementId: descriptors.userPreviewMainIdentifierText.setId(elementId),
					as: "span",
					truncate: true,
					sx: { fontWeight: "inherit" },
					children: previewTitle
				}), badge]
			}), (subtitle || name && identifier) && /* @__PURE__ */ jsx(Text, {
				elementDescriptor: descriptors.userPreviewSecondaryIdentifier,
				elementId: descriptors.userPreviewSecondaryIdentifier.setId(elementId),
				truncate: true,
				as: "span",
				localizationKey: subtitle || identifier,
				colorScheme: "secondary",
				...subtitleProps
			})]
		})]
	});
};

//#endregion
export { UserPreview };
//# sourceMappingURL=UserPreview.js.map