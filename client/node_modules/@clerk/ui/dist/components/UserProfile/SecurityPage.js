import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { ActiveDevicesSection } from "./ActiveDevicesSection.js";
import { SecurityDelete, SecurityMfa, SecurityPasskeys, SecurityPassword } from "./SecuritySections.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/SecurityPage.tsx
const SecurityPage = withCardStateProvider(() => {
	const card = useCardState();
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsxs(ProfileCard.PagePanel, {
		pageId: "security",
		titleKey: localizationKeys("userProfile.start.headerTitle__security"),
		alertContent: card.error,
		children: [
			/* @__PURE__ */ jsx(SecurityPassword, {}),
			/* @__PURE__ */ jsx(SecurityPasskeys, {}),
			/* @__PURE__ */ jsx(SecurityMfa, {}),
			/* @__PURE__ */ jsx(ActiveDevicesSection, {}),
			/* @__PURE__ */ jsx(SecurityDelete, {})
		]
	}) });
});

//#endregion
export { SecurityPage };
//# sourceMappingURL=SecurityPage.js.map