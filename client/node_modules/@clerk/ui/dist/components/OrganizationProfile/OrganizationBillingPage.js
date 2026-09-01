import { localizationKeys } from "../../localization/localizationKeys.js";
import { Protect } from "../../common/Gate.js";
import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Col } from "../../customizables/index.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { Tab, TabPanel, TabPanels, Tabs, TabsList } from "../../elements/Tabs.js";
import { AccountCredits } from "../AccountCredits/AccountCredits.js";
import { useTabState } from "../../hooks/useTabState.js";
import { PaymentAttemptsList } from "../PaymentAttempts/PaymentAttemptsList.js";
import { PaymentMethods } from "../PaymentMethods/PaymentMethods.js";
import { StatementsList } from "../Statements/StatementsList.js";
import { SubscriptionsList } from "../Subscriptions/SubscriptionsList.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/OrganizationBillingPage.tsx
const orgTabMap = {
	0: "subscriptions",
	1: "statements",
	2: "payments"
};
const OrganizationBillingPageInternal = withCardStateProvider(() => {
	const card = useCardState();
	const { selectedTab, handleTabChange } = useTabState(orgTabMap);
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsx(Col, {
		elementDescriptor: descriptors.page,
		sx: (t) => ({
			gap: t.space.$8,
			color: t.colors.$colorForeground,
			isolation: "isolate"
		}),
		children: /* @__PURE__ */ jsxs(Col, {
			elementDescriptor: descriptors.profilePage,
			elementId: descriptors.profilePage.setId("billing"),
			gap: 4,
			children: [
				/* @__PURE__ */ jsx(Header.Root, { children: /* @__PURE__ */ jsx(Header.Title, {
					localizationKey: localizationKeys("organizationProfile.billingPage.title"),
					textVariant: "h2"
				}) }),
				/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
				/* @__PURE__ */ jsxs(Tabs, {
					value: selectedTab,
					onChange: handleTabChange,
					children: [/* @__PURE__ */ jsxs(TabsList, {
						sx: (t) => ({ gap: t.space.$6 }),
						children: [
							/* @__PURE__ */ jsx(Tab, { localizationKey: localizationKeys("organizationProfile.billingPage.start.headerTitle__subscriptions") }),
							/* @__PURE__ */ jsx(Tab, { localizationKey: localizationKeys("organizationProfile.billingPage.start.headerTitle__statements") }),
							/* @__PURE__ */ jsx(Tab, { localizationKey: localizationKeys("organizationProfile.billingPage.start.headerTitle__payments") })
						]
					}), /* @__PURE__ */ jsxs(TabPanels, { children: [
						/* @__PURE__ */ jsxs(TabPanel, {
							sx: {
								width: "100%",
								flexDirection: "column"
							},
							children: [
								/* @__PURE__ */ jsx(SubscriptionsList, {
									title: localizationKeys("organizationProfile.billingPage.subscriptionsListSection.title"),
									switchPlansLabel: localizationKeys("organizationProfile.billingPage.subscriptionsListSection.actionLabel__switchPlan"),
									newSubscriptionLabel: localizationKeys("organizationProfile.billingPage.subscriptionsListSection.actionLabel__newSubscription"),
									manageSubscriptionLabel: localizationKeys("organizationProfile.billingPage.subscriptionsListSection.actionLabel__manageSubscription")
								}),
								/* @__PURE__ */ jsx(Protect, {
									condition: (has) => has({ permission: "org:sys_billing:manage" }),
									children: /* @__PURE__ */ jsx(PaymentMethods, {})
								}),
								/* @__PURE__ */ jsx(AccountCredits, {})
							]
						}),
						/* @__PURE__ */ jsx(TabPanel, {
							sx: { width: "100%" },
							children: /* @__PURE__ */ jsx(StatementsList, {})
						}),
						/* @__PURE__ */ jsx(TabPanel, {
							sx: { width: "100%" },
							children: /* @__PURE__ */ jsx(PaymentAttemptsList, {})
						})
					] })]
				})
			]
		})
	}) });
});
const OrganizationBillingPage = () => {
	return /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
		value: "organization",
		children: /* @__PURE__ */ jsx(OrganizationBillingPageInternal, {})
	});
};

//#endregion
export { OrganizationBillingPage };
//# sourceMappingURL=OrganizationBillingPage.js.map