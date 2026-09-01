'use client';

import { Protect } from "../../common/Gate.js";
import { useRequirePage } from "../useRequirePage.js";
import { OrganizationDomainsSection } from "../../components/OrganizationProfile/OrganizationGeneralPage.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/OrganizationProfile/GeneralVerifiedDomains.tsx
function OrganizationProfileDomainsSection() {
	if (!useRequirePage("OrganizationProfileDomainsSection")) return null;
	return /* @__PURE__ */ jsx(Protect, {
		permission: "org:sys_domains:read",
		children: /* @__PURE__ */ jsx(OrganizationDomainsSection, {})
	});
}

//#endregion
export { OrganizationProfileDomainsSection };
//# sourceMappingURL=GeneralVerifiedDomains.js.map