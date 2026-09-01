import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { StatementPage } from "../Statements/StatementPage.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/OrganizationStatementPage.tsx
const OrganizationStatementPage = () => {
	return /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
		value: "organization",
		children: /* @__PURE__ */ jsx(StatementPage, {})
	});
};

//#endregion
export { OrganizationStatementPage };
//# sourceMappingURL=OrganizationStatementPage.js.map