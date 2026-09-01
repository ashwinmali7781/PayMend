import { localizationKeys } from "../../localization/localizationKeys.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { ProfileSection } from "../../elements/Section.js";
import { DeleteUserForm } from "./DeleteUserForm.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/DeleteSection.tsx
const DeleteUserScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(DeleteUserForm, {
		onSuccess: close,
		onReset: close
	});
};
const DeleteSection = () => {
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		title: localizationKeys("userProfile.start.dangerSection.title"),
		id: "danger",
		sx: {
			alignItems: "center",
			[mqu.md]: { alignItems: "flex-start" }
		},
		children: /* @__PURE__ */ jsxs(Action.Root, { children: [/* @__PURE__ */ jsx(Action.Closed, {
			value: "delete",
			children: /* @__PURE__ */ jsx(ProfileSection.Item, {
				id: "danger",
				sx: (t) => ({ paddingInlineStart: t.space.$1 }),
				children: /* @__PURE__ */ jsx(Action.Trigger, {
					value: "delete",
					children: /* @__PURE__ */ jsx(ProfileSection.Button, {
						id: "danger",
						variant: "ghost",
						colorScheme: "danger",
						localizationKey: localizationKeys("userProfile.start.dangerSection.deleteAccountButton")
					})
				})
			})
		}), /* @__PURE__ */ jsx(Action.Open, {
			value: "delete",
			children: /* @__PURE__ */ jsx(Action.Card, {
				variant: "destructive",
				children: /* @__PURE__ */ jsx(DeleteUserScreen, {})
			})
		})] })
	});
};

//#endregion
export { DeleteSection };
//# sourceMappingURL=DeleteSection.js.map