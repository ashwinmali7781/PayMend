import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Col, Text } from "../../customizables/index.js";
import { AvatarUploader } from "../../elements/AvatarUploader.js";
import { OrganizationAvatar } from "../../elements/OrganizationAvatar.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/OrganizationProfileAvatarUploader.tsx
const OrganizationProfileAvatarUploader = (props) => {
	const { organization, showLoadingSpinner, ...rest } = props;
	return /* @__PURE__ */ jsxs(Col, {
		elementDescriptor: descriptors.organizationAvatarUploaderContainer,
		children: [/* @__PURE__ */ jsx(Text, {
			variant: "subtitle",
			sx: (t) => ({
				textAlign: "start",
				marginBottom: t.space.$2
			}),
			localizationKey: localizationKeys("organizationProfile.start.profileSection.uploadAction__title")
		}), /* @__PURE__ */ jsx(AvatarUploader, {
			...rest,
			rounded: false,
			title: localizationKeys("userProfile.profilePage.imageFormTitle"),
			avatarPreview: /* @__PURE__ */ jsx(OrganizationAvatar, {
				size: (theme) => theme.sizes.$16,
				showLoadingSpinner,
				...organization
			})
		})]
	});
};

//#endregion
export { OrganizationProfileAvatarUploader };
//# sourceMappingURL=OrganizationProfileAvatarUploader.js.map