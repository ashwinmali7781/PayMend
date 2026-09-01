import { localizationKeys } from "../../localization/localizationKeys.js";
import { AvatarUploader } from "../../elements/AvatarUploader.js";
import { UserAvatar } from "../../elements/UserAvatar.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/UserProfileAvatarUploader.tsx
const UserProfileAvatarUploader = (props) => {
	const { user, ...rest } = props;
	return /* @__PURE__ */ jsx(AvatarUploader, {
		...rest,
		title: localizationKeys("userProfile.profilePage.imageFormTitle"),
		avatarPreview: /* @__PURE__ */ jsx(UserAvatar, {
			size: (theme) => theme.sizes.$12,
			...user
		})
	});
};

//#endregion
export { UserProfileAvatarUploader };
//# sourceMappingURL=UserProfileAvatarUploader.js.map