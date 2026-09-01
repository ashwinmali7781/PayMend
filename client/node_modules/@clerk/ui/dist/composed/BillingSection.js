'use client';

import { RouteContext } from "../router/RouteContext.js";
import { useBillingRouter } from "./useBillingRouter.js";
import { Suspense } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/BillingSection.tsx
function BillingSection({ billing: Billing, plans: Plans, statement: Statement, paymentAttempt: PaymentAttempt }) {
	const { router, route } = useBillingRouter();
	let content;
	switch (route.page) {
		case "plans":
			content = /* @__PURE__ */ jsx(Plans, {});
			break;
		case "statement":
			content = /* @__PURE__ */ jsx(Statement, {});
			break;
		case "payment-attempt":
			content = /* @__PURE__ */ jsx(PaymentAttempt, {});
			break;
		default: content = /* @__PURE__ */ jsx(Billing, {});
	}
	return /* @__PURE__ */ jsx(RouteContext.Provider, {
		value: router,
		children: /* @__PURE__ */ jsx(Suspense, {
			fallback: null,
			children: content
		})
	});
}

//#endregion
export { BillingSection };
//# sourceMappingURL=BillingSection.js.map