'use client';

import { BillingSection } from "../BillingSection.js";
import { lazy } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/UserProfile/Billing.tsx
const BillingPage = lazy(() => import("../../components/UserProfile/BillingPage.js").then((m) => ({ default: m.BillingPage })));
const PlansPage = lazy(() => import("../../components/UserProfile/PlansPage.js").then((m) => ({ default: m.PlansPage })));
const StatementPage = lazy(() => import("../../components/Statements/index.js").then((m) => ({ default: m.StatementPage })));
const PaymentAttemptPage = lazy(() => import("../../components/PaymentAttempts/index.js").then((m) => ({ default: m.PaymentAttemptPage })));
const UserProfileBillingPanel = () => /* @__PURE__ */ jsx(BillingSection, {
	billing: BillingPage,
	plans: PlansPage,
	statement: StatementPage,
	paymentAttempt: PaymentAttemptPage
});

//#endregion
export { UserProfileBillingPanel };
//# sourceMappingURL=Billing.js.map