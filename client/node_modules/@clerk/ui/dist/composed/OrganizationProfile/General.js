'use client';

import { localizationKeys } from "../../localization/localizationKeys.js";
import { CardStateProvider, useCardState } from "../../elements/contexts/index.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { PageContext } from "../PageContext.js";
import { OrganizationGeneralPage } from "../../components/OrganizationProfile/OrganizationGeneralPage.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/OrganizationProfile/General.tsx
function GeneralComposed({ children }) {
	const card = useCardState();
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsx(ProfileCard.PagePanel, {
		pageId: "organizationGeneral",
		titleKey: localizationKeys("organizationProfile.start.headerTitle__general"),
		alertContent: card.error,
		children
	}) });
}
function OrganizationProfileGeneralPanel({ children }) {
	if (!children) return /* @__PURE__ */ jsx(CardStateProvider, { children: /* @__PURE__ */ jsx(OrganizationGeneralPage, {}) });
	return /* @__PURE__ */ jsx(PageContext.Provider, {
		value: "general",
		children: /* @__PURE__ */ jsx(CardStateProvider, { children: /* @__PURE__ */ jsx(GeneralComposed, { children }) })
	});
}

//#endregion
export { OrganizationProfileGeneralPanel };
//# sourceMappingURL=General.js.map