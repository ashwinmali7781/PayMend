import { localizationKeys } from "../../localization/localizationKeys.js";
import { Text } from "../../customizables/index.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { ProfileSection } from "../../elements/Section.js";
import { PasswordForm } from "./PasswordForm.js";
import { useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/PasswordSection.tsx
const PasswordScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(PasswordForm, {
		onSuccess: close,
		onReset: close
	});
};
const PasswordSection = () => {
	const { user } = useUser();
	if (!user) return null;
	const { passwordEnabled } = user;
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		centered: false,
		title: localizationKeys("userProfile.start.passwordSection.title"),
		id: "password",
		children: /* @__PURE__ */ jsxs(Action.Root, { children: [/* @__PURE__ */ jsx(Action.Closed, {
			value: "edit",
			children: /* @__PURE__ */ jsxs(ProfileSection.Item, {
				id: "password",
				sx: (t) => ({
					paddingInlineStart: !passwordEnabled ? "0" : void 0,
					paddingTop: t.space.$0x25,
					paddingBottom: t.space.$0x25
				}),
				children: [passwordEnabled && /* @__PURE__ */ jsx(Text, {
					variant: "h2",
					children: "••••••••••"
				}), /* @__PURE__ */ jsx(Action.Trigger, {
					value: "edit",
					children: /* @__PURE__ */ jsx(ProfileSection.Button, {
						id: "password",
						localizationKey: passwordEnabled ? localizationKeys("userProfile.start.passwordSection.primaryButton__updatePassword") : localizationKeys("userProfile.start.passwordSection.primaryButton__setPassword")
					})
				})]
			})
		}), /* @__PURE__ */ jsx(Action.Open, {
			value: "edit",
			children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(PasswordScreen, {}) })
		})] })
	});
};

//#endregion
export { PasswordSection };
//# sourceMappingURL=PasswordSection.js.map