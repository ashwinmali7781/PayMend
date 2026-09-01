import { USER_PROFILE_NAVBAR_ROUTE_ID } from "../../constants.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { Route } from "../../router/Route.js";
import { Switch } from "../../router/Switch.js";
import { useUserProfileContext } from "../../contexts/components/UserProfile.js";
import { CustomPageContentContainer } from "../../common/CustomPageContentContainer.js";
import { AccountPage } from "./AccountPage.js";
import { SecurityPage } from "./SecurityPage.js";
import { Suspense, lazy } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/UserProfileRoutes.tsx
const BillingPage = lazy(() => import(
	/* webpackChunkName: "up-billing-page"*/
	"./BillingPage.js"
).then((module) => ({ default: module.BillingPage })));
const APIKeysPage = lazy(() => import(
	/* webpackChunkName: "up-api-keys-page"*/
	"./APIKeysPage.js"
).then((module) => ({ default: module.APIKeysPage })));
const PlansPage = lazy(() => import(
	/* webpackChunkName: "up-plans-page"*/
	"./PlansPage.js"
).then((module) => ({ default: module.PlansPage })));
const StatementPage = lazy(() => import(
	/* webpackChunkName: "statement-page"*/
	"../Statements/index.js"
).then((module) => ({ default: module.StatementPage })));
const PaymentAttemptPage = lazy(() => import(
	/* webpackChunkName: "payment-attempt-page"*/
	"../PaymentAttempts/index.js"
).then((module) => ({ default: module.PaymentAttemptPage })));
const CreditHistoryPage = lazy(() => import(
	/* webpackChunkName: "credit-history-page"*/
	"../AccountCredits/index.js"
).then((module) => ({ default: module.CreditHistoryPage })));
const UserProfileRoutes = () => {
	const { pages, shouldShowBilling, apiKeysProps } = useUserProfileContext();
	const { apiKeysSettings, commerceSettings } = useEnvironment();
	const isAccountPageRoot = pages.routes[0].id === USER_PROFILE_NAVBAR_ROUTE_ID.ACCOUNT;
	const isSecurityPageRoot = pages.routes[0].id === USER_PROFILE_NAVBAR_ROUTE_ID.SECURITY;
	const isBillingPageRoot = pages.routes[0].id === USER_PROFILE_NAVBAR_ROUTE_ID.BILLING;
	const isAPIKeysPageRoot = pages.routes[0].id === USER_PROFILE_NAVBAR_ROUTE_ID.API_KEYS;
	const customPageRoutesWithContents = pages.contents?.map((customPage, index) => {
		const shouldFirstCustomItemBeOnRoot = !isAccountPageRoot && !isSecurityPageRoot && index === 0;
		return /* @__PURE__ */ jsx(Route, {
			index: shouldFirstCustomItemBeOnRoot,
			path: shouldFirstCustomItemBeOnRoot ? void 0 : customPage.url,
			children: /* @__PURE__ */ jsx(CustomPageContentContainer, {
				mount: customPage.mount,
				unmount: customPage.unmount
			})
		}, `custom-page-${customPage.url}`);
	});
	return /* @__PURE__ */ jsxs(Switch, { children: [customPageRoutesWithContents, /* @__PURE__ */ jsxs(Route, { children: [
		/* @__PURE__ */ jsx(Route, {
			path: isAccountPageRoot ? void 0 : "account",
			children: /* @__PURE__ */ jsx(Switch, { children: /* @__PURE__ */ jsx(Route, {
				index: true,
				children: /* @__PURE__ */ jsx(AccountPage, {})
			}) })
		}),
		/* @__PURE__ */ jsx(Route, {
			path: isSecurityPageRoot ? void 0 : "security",
			children: /* @__PURE__ */ jsx(Switch, { children: /* @__PURE__ */ jsx(Route, {
				index: true,
				children: /* @__PURE__ */ jsx(SecurityPage, {})
			}) })
		}),
		commerceSettings.billing.user.enabled && shouldShowBilling ? /* @__PURE__ */ jsx(Route, {
			path: isBillingPageRoot ? void 0 : "billing",
			children: /* @__PURE__ */ jsxs(Switch, { children: [
				/* @__PURE__ */ jsx(Route, {
					index: true,
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: "",
						children: /* @__PURE__ */ jsx(BillingPage, {})
					})
				}),
				commerceSettings.billing.user.hasPaidPlans ? /* @__PURE__ */ jsx(Route, {
					path: "plans",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: "",
						children: /* @__PURE__ */ jsx(PlansPage, {})
					})
				}) : null,
				/* @__PURE__ */ jsx(Route, {
					path: "statement/:statementId",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: "",
						children: /* @__PURE__ */ jsx(StatementPage, {})
					})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "payment-attempt/:paymentAttemptId",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: "",
						children: /* @__PURE__ */ jsx(PaymentAttemptPage, {})
					})
				}),
				/* @__PURE__ */ jsx(Route, {
					path: "credit-history",
					children: /* @__PURE__ */ jsx(Suspense, {
						fallback: "",
						children: /* @__PURE__ */ jsx(CreditHistoryPage, {})
					})
				})
			] })
		}) : null,
		apiKeysSettings.user_api_keys_enabled && !apiKeysProps?.hide && /* @__PURE__ */ jsx(Route, {
			path: isAPIKeysPageRoot ? void 0 : "api-keys",
			children: /* @__PURE__ */ jsx(Switch, { children: /* @__PURE__ */ jsx(Route, {
				index: true,
				children: /* @__PURE__ */ jsx(Suspense, {
					fallback: "",
					children: /* @__PURE__ */ jsx(APIKeysPage, {})
				})
			}) })
		})
	] })] });
};

//#endregion
export { UserProfileRoutes };
//# sourceMappingURL=UserProfileRoutes.js.map