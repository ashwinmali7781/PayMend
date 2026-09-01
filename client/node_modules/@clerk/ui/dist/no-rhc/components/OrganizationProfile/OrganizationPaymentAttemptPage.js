import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { PaymentAttemptPage } from "../PaymentAttempts/PaymentAttemptPage.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/OrganizationPaymentAttemptPage.tsx
const OrganizationPaymentAttemptPage = () => {
	return /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
		value: "organization",
		children: /* @__PURE__ */ jsx(PaymentAttemptPage, {})
	});
};

//#endregion
export { OrganizationPaymentAttemptPage };
//# sourceMappingURL=OrganizationPaymentAttemptPage.js.map