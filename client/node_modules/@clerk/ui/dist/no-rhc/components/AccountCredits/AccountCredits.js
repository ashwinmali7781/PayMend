import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSubscriberTypeLocalizationRoot } from "../../contexts/components/SubscriberType.js";
import { useCreditBalance } from "../../contexts/components/Plans.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { Text } from "../../customizables/index.js";
import { ProfileSection } from "../../elements/Section.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/AccountCredits/AccountCredits.tsx
const AccountCredits = () => {
	const { data: creditBalance, isLoading } = useCreditBalance();
	const localizationRoot = useSubscriberTypeLocalizationRoot();
	const { navigate } = useRouter();
	const { $ } = useLocalizations();
	if (!creditBalance?.balance || isLoading) return null;
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		title: localizationKeys(`${localizationRoot}.billingPage.accountCreditsSection.title`),
		centered: false,
		id: "accountCredits",
		sx: (t) => ({
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100
		}),
		children: /* @__PURE__ */ jsxs(ProfileSection.ItemList, {
			id: "accountCredits",
			disableAnimation: true,
			children: [/* @__PURE__ */ jsx(ProfileSection.Item, {
				id: "accountCredits",
				children: /* @__PURE__ */ jsx(Text, {
					variant: "subtitle",
					children: $(creditBalance.balance)
				})
			}), /* @__PURE__ */ jsx(ProfileSection.Button, {
				id: "accountCredits",
				localizationKey: localizationKeys(`${localizationRoot}.billingPage.accountCreditsSection.viewHistory`),
				sx: [(t) => ({
					justifyContent: "start",
					height: t.sizes.$8
				})],
				onClick: () => void navigate("credit-history")
			})]
		})
	});
};

//#endregion
export { AccountCredits };
//# sourceMappingURL=AccountCredits.js.map