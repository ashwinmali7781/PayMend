import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { AccountConnectedAccounts, AccountEmails, AccountEnterpriseAccounts, AccountPhone, AccountUsername, AccountWeb3 } from "./AccountSections.js";
import { UserProfileSection } from "./UserProfileSection.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/AccountPage.tsx
const AccountPage = withCardStateProvider(() => {
	const card = useCardState();
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsxs(ProfileCard.PagePanel, {
		pageId: "account",
		titleKey: localizationKeys("userProfile.start.headerTitle__account"),
		alertContent: card.error,
		outerSx: (t) => ({
			gap: t.space.$8,
			color: t.colors.$colorForeground,
			isolation: "isolate"
		}),
		children: [
			/* @__PURE__ */ jsx(UserProfileSection, {}),
			/* @__PURE__ */ jsx(AccountUsername, {}),
			/* @__PURE__ */ jsx(AccountEmails, {}),
			/* @__PURE__ */ jsx(AccountPhone, {}),
			/* @__PURE__ */ jsx(AccountConnectedAccounts, {}),
			/* @__PURE__ */ jsx(AccountEnterpriseAccounts, {}),
			/* @__PURE__ */ jsx(AccountWeb3, {})
		]
	}) });
});

//#endregion
export { AccountPage };
//# sourceMappingURL=AccountPage.js.map