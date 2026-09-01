import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { Protect } from "../../common/Gate.js";
import { useOrganizationProfileContext } from "../../contexts/components/OrganizationProfile.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { Col, Flex, Text } from "../../customizables/index.js";
import { Header } from "../../elements/Header.js";
import { ProfileSection } from "../../elements/Section.js";
import { DomainList } from "./DomainList.js";
import { MembersActionsRow } from "./MembersActions.js";
import { RequestToJoinList } from "./RequestToJoinList.js";
import { Fragment, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/OrganizationMembersTabRequests.tsx
const OrganizationMembersTabRequests = () => {
	const { organizationSettings } = useEnvironment();
	const { navigateToGeneralPageRoot } = useOrganizationProfileContext();
	const isDomainsEnabled = organizationSettings?.domains?.enabled;
	return /* @__PURE__ */ jsxs(Col, {
		gap: 4,
		sx: { width: "100%" },
		children: [isDomainsEnabled && /* @__PURE__ */ jsx(Protect, {
			permission: "org:sys_domains:manage",
			children: /* @__PURE__ */ jsxs(Flex, {
				sx: (t) => ({
					width: "100%",
					gap: t.space.$8,
					paddingBottom: t.space.$4,
					paddingInlineStart: t.space.$1,
					paddingInlineEnd: t.space.$1,
					borderBottomWidth: t.borderWidths.$normal,
					borderBottomStyle: t.borderStyles.$solid,
					borderBottomColor: t.colors.$borderAlpha100,
					[mqu.md]: {
						flexDirection: "column",
						gap: t.space.$2
					}
				}),
				children: [/* @__PURE__ */ jsx(Col, {
					sx: (t) => ({
						width: t.space.$66,
						marginTop: t.space.$2
					}),
					children: /* @__PURE__ */ jsx(Header.Root, { children: /* @__PURE__ */ jsx(Header.Title, {
						localizationKey: localizationKeys("organizationProfile.membersPage.requestsTab.autoSuggestions.headerTitle"),
						textVariant: "h3"
					}) })
				}), /* @__PURE__ */ jsx(Col, {
					sx: { width: "100%" },
					children: /* @__PURE__ */ jsx(DomainList, {
						fallback: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ProfileSection.ArrowButton, {
							localizationKey: localizationKeys("organizationProfile.membersPage.requestsTab.autoSuggestions.primaryButton"),
							sx: (t) => ({ gap: t.space.$2 }),
							id: "manageVerifiedDomains",
							onClick: navigateToGeneralPageRoot
						}), /* @__PURE__ */ jsx(Text, {
							localizationKey: localizationKeys("organizationProfile.membersPage.requestsTab.autoSuggestions.headerSubtitle"),
							sx: (t) => ({
								paddingInlineStart: t.space.$8x5,
								color: t.colors.$colorMutedForeground,
								[mqu.md]: { paddingInlineStart: 0 }
							})
						})] }),
						verificationStatus: "verified",
						enrollmentMode: "automatic_suggestion"
					})
				})]
			})
		}), /* @__PURE__ */ jsxs(Flex, {
			direction: "col",
			gap: 2,
			sx: { width: "100%" },
			children: [/* @__PURE__ */ jsx(MembersActionsRow, {}), /* @__PURE__ */ jsx(RequestToJoinList, {})]
		})]
	});
};

//#endregion
export { OrganizationMembersTabRequests };
//# sourceMappingURL=OrganizationMembersTabRequests.js.map