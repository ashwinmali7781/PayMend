'use client';

import { localizationKeys } from "../../localization/localizationKeys.js";
import { CardStateProvider, useCardState } from "../../elements/contexts/index.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { PageContext } from "../PageContext.js";
import { SecurityPage } from "../../components/UserProfile/SecurityPage.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/UserProfile/Security.tsx
function SecurityComposed({ children }) {
	const card = useCardState();
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsx(ProfileCard.PagePanel, {
		pageId: "security",
		titleKey: localizationKeys("userProfile.start.headerTitle__security"),
		alertContent: card.error,
		children
	}) });
}
function UserProfileSecurityPanel({ children }) {
	if (!children) return /* @__PURE__ */ jsx(SecurityPage, {});
	return /* @__PURE__ */ jsx(PageContext.Provider, {
		value: "security",
		children: /* @__PURE__ */ jsx(CardStateProvider, { children: /* @__PURE__ */ jsx(SecurityComposed, { children }) })
	});
}

//#endregion
export { UserProfileSecurityPanel };
//# sourceMappingURL=Security.js.map