'use client';

import { localizationKeys } from "../../localization/localizationKeys.js";
import { CardStateProvider, useCardState } from "../../elements/contexts/index.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { AccountPage } from "../../components/UserProfile/AccountPage.js";
import { PageContext } from "../PageContext.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/UserProfile/Account.tsx
function AccountComposed({ children }) {
	const card = useCardState();
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsx(ProfileCard.PagePanel, {
		pageId: "account",
		titleKey: localizationKeys("userProfile.start.headerTitle__account"),
		alertContent: card.error,
		outerSx: (t) => ({
			gap: t.space.$8,
			color: t.colors.$colorForeground,
			isolation: "isolate"
		}),
		children
	}) });
}
function UserProfileAccountPanel({ children }) {
	if (!children) return /* @__PURE__ */ jsx(AccountPage, {});
	return /* @__PURE__ */ jsx(PageContext.Provider, {
		value: "account",
		children: /* @__PURE__ */ jsx(CardStateProvider, { children: /* @__PURE__ */ jsx(AccountComposed, { children }) })
	});
}

//#endregion
export { UserProfileAccountPanel };
//# sourceMappingURL=Account.js.map