'use client';

import { BillingSection } from "../BillingSection.js";
import { lazy } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/OrganizationProfile/Billing.tsx
const OrganizationBillingPage = lazy(() => import("../../components/OrganizationProfile/OrganizationBillingPage.js").then((m) => ({ default: m.OrganizationBillingPage })));
const OrganizationPlansPage = lazy(() => import("../../components/OrganizationProfile/OrganizationPlansPage.js").then((m) => ({ default: m.OrganizationPlansPage })));
const OrganizationStatementPage = lazy(() => import("../../components/OrganizationProfile/OrganizationStatementPage.js").then((m) => ({ default: m.OrganizationStatementPage })));
const OrganizationPaymentAttemptPage = lazy(() => import("../../components/OrganizationProfile/OrganizationPaymentAttemptPage.js").then((m) => ({ default: m.OrganizationPaymentAttemptPage })));
const OrganizationProfileBillingPanel = () => /* @__PURE__ */ jsx(BillingSection, {
	billing: OrganizationBillingPage,
	plans: OrganizationPlansPage,
	statement: OrganizationStatementPage,
	paymentAttempt: OrganizationPaymentAttemptPage
});

//#endregion
export { OrganizationProfileBillingPanel };
//# sourceMappingURL=Billing.js.map