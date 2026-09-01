import { localizationKeys } from "../../localization/localizationKeys.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { ProfileSection } from "../../elements/Section.js";
import { UserPreview } from "../../elements/UserPreview.js";
import { ProfileForm } from "./ProfileForm.js";
import { useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/UserProfileSection.tsx
const ProfileScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(ProfileForm, {
		onSuccess: close,
		onReset: close
	});
};
const UserProfileSection = () => {
	const { user } = useUser();
	if (!user) return null;
	const { username, primaryEmailAddress, primaryPhoneNumber, primaryWeb3Wallet, ...userWithoutIdentifiers } = user;
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		title: localizationKeys("userProfile.start.profileSection.title"),
		id: "profile",
		sx: { [mqu.md]: { alignItems: "flex-start" } },
		children: /* @__PURE__ */ jsxs(Action.Root, { children: [/* @__PURE__ */ jsx(Action.Closed, {
			value: "edit",
			children: /* @__PURE__ */ jsxs(ProfileSection.Item, {
				id: "profile",
				children: [/* @__PURE__ */ jsx(UserPreview, {
					user: userWithoutIdentifiers,
					size: "lg",
					mainIdentifierVariant: "subtitle",
					sx: (t) => ({ color: t.colors.$colorForeground })
				}), /* @__PURE__ */ jsx(Action.Trigger, {
					value: "edit",
					children: /* @__PURE__ */ jsx(ProfileSection.Button, {
						id: "profile",
						localizationKey: localizationKeys("userProfile.start.profileSection.primaryButton")
					})
				})]
			})
		}), /* @__PURE__ */ jsx(Action.Open, {
			value: "edit",
			children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(ProfileScreen, {}) })
		})] })
	});
};

//#endregion
export { UserProfileSection };
//# sourceMappingURL=UserProfileSection.js.map