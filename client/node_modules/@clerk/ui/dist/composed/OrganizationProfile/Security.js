'use client';

import { CardStateProvider } from "../../elements/contexts/index.js";
import { OrganizationSecurityPage } from "../../components/OrganizationProfile/OrganizationSecurityPage.js";
import { useRef } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/OrganizationProfile/Security.tsx
const OrganizationProfileSecurityPanel = () => {
	return /* @__PURE__ */ jsx(CardStateProvider, { children: /* @__PURE__ */ jsx(OrganizationSecurityPage, { contentRef: useRef(null) }) });
};

//#endregion
export { OrganizationProfileSecurityPanel };
//# sourceMappingURL=Security.js.map