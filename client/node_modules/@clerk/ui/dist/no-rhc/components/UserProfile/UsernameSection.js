import { localizationKeys } from "../../localization/localizationKeys.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { Text } from "../../customizables/index.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { ProfileSection } from "../../elements/Section.js";
import { UsernameForm } from "./UsernameForm.js";
import { useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/UsernameSection.tsx
const UsernameScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(UsernameForm, {
		onSuccess: close,
		onReset: close
	});
};
const UsernameSection = ({ isImmutable }) => {
	const { user } = useUser();
	if (!user) return null;
	if (isImmutable && !user.username) return null;
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		title: localizationKeys("userProfile.start.usernameSection.title"),
		id: "username",
		sx: {
			alignItems: "center",
			[mqu.md]: { alignItems: "flex-start" }
		},
		children: /* @__PURE__ */ jsxs(Action.Root, { children: [/* @__PURE__ */ jsx(Action.Closed, {
			value: "edit",
			children: /* @__PURE__ */ jsxs(ProfileSection.Item, {
				id: "username",
				sx: { paddingInlineStart: !user.username ? "0" : void 0 },
				children: [user.username && /* @__PURE__ */ jsx(Text, {
					truncate: true,
					sx: (t) => ({ color: t.colors.$colorForeground }),
					children: user.username
				}), !isImmutable && /* @__PURE__ */ jsx(Action.Trigger, {
					value: "edit",
					children: /* @__PURE__ */ jsx(ProfileSection.Button, {
						id: "username",
						localizationKey: user.username ? localizationKeys("userProfile.start.usernameSection.primaryButton__updateUsername") : localizationKeys("userProfile.start.usernameSection.primaryButton__setUsername")
					})
				})]
			})
		}), /* @__PURE__ */ jsx(Action.Open, {
			value: "edit",
			children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(UsernameScreen, {}) })
		})] })
	});
};

//#endregion
export { UsernameSection };
//# sourceMappingURL=UsernameSection.js.map