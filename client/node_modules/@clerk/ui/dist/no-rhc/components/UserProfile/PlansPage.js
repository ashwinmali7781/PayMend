import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { PricingTableContext } from "../../contexts/components/PricingTable.js";
import { Header } from "../../elements/Header.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { PricingTable } from "../PricingTable/PricingTable.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/PlansPage.tsx
const PlansPageInternal = () => {
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
				localizationKey: localizationKeys("userProfile.plansPage.title"),
				textVariant: "h2"
			})
		})
	}), /* @__PURE__ */ jsx(PricingTableContext.Provider, {
		value: {
			componentName: "PricingTable",
			mode: "modal"
		},
		children: /* @__PURE__ */ jsx(PricingTable, {})
	})] });
};
const PlansPage = () => {
	return /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
		value: "user",
		children: /* @__PURE__ */ jsx(PlansPageInternal, {})
	});
};

//#endregion
export { PlansPage };
//# sourceMappingURL=PlansPage.js.map