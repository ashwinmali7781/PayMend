import { withCoreUserGuard } from "../../contexts/CoreUserContext.js";
import { useUserAvatarContext } from "../../contexts/components/UserAvatar.js";
import { InternalThemeProvider } from "../../styledSystem/InternalThemeProvider.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { UserAvatar as UserAvatar$1 } from "../../elements/UserAvatar.js";
import { jsx } from "@emotion/react/jsx-runtime";
import { useUser } from "@clerk/shared/react/index";

//#region src/components/UserAvatar/index.tsx
const _UserAvatar = (props) => {
	const ctx = useUserAvatarContext();
	const { user } = useUser();
	return /* @__PURE__ */ jsx(InternalThemeProvider, { children: /* @__PURE__ */ jsx(UserAvatar$1, {
		boxElementDescriptor: descriptors.userAvatarBox,
		imageElementDescriptor: descriptors.userAvatarImage,
		...user,
		rounded: props.rounded ?? ctx.rounded ?? true,
		size: (theme) => theme.sizes.$7
	}) });
};
const UserAvatar = withCoreUserGuard(_UserAvatar);

//#endregion
export { UserAvatar, _UserAvatar };
//# sourceMappingURL=index.js.map