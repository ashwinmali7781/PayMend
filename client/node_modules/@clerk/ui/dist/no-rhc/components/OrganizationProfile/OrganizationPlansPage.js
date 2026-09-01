import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { Protect } from "../../common/Gate.js";
import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { PricingTableContext } from "../../contexts/components/PricingTable.js";
import { Flex } from "../../customizables/index.js";
import { Alert } from "../../elements/Alert.js";
import { Header } from "../../elements/Header.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { PricingTable } from "../PricingTable/PricingTable.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/OrganizationPlansPage.tsx
const OrganizationPlansPageInternal = () => {
	const { navigate } = useRouter();
	return /* @__PURE__ */ jsxs(ProfileCard.Page, { children: [/* @__PURE__ */ jsx(Header.Root, {
		sx: (t) => ({
			borderBottomWidth: t.borderWidths.$normal,
			borderBottomStyle: t.borderStyles.$solid,
			borderBottomColor: t.colors.$borderAlpha100,
			marginBlockEnd: t.space.$4,
			paddingBlockEnd: t.space.$4
		}),
		children: /* @__PURE__ */ jsx(Header.BackLink, {
			onClick: () => void navigate("../", { searchParams: new URLSearchParams("tab=subscriptions") }),
			children: /* @__PURE__ */ jsx(Header.Title, {
				localizationKey: localizationKeys("organizationProfile.plansPage.title"),
				textVariant: "h2"
			})
		})
	}), /* @__PURE__ */ jsxs(Flex, {
		direction: "col",
		gap: 4,
		children: [/* @__PURE__ */ jsx(Protect, {
			condition: (has) => !has({ permission: "org:sys_billing:manage" }),
			children: /* @__PURE__ */ jsx(Alert, {
				variant: "info",
				colorScheme: "info",
				title: localizationKeys("organizationProfile.plansPage.alerts.noPermissionsToManageBilling")
			})
		}), /* @__PURE__ */ jsx(PricingTableContext.Provider, {
			value: {
				componentName: "PricingTable",
				mode: "modal"
			},
			children: /* @__PURE__ */ jsx(PricingTable, {})
		})]
	})] });
};
const OrganizationPlansPage = () => {
	return /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
		value: "organization",
		children: /* @__PURE__ */ jsx(OrganizationPlansPageInternal, {})
	});
};

//#endregion
export { OrganizationPlansPage };
//# sourceMappingURL=OrganizationPlansPage.js.map