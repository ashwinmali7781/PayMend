'use client';

import { APIKeysSection } from "../APIKeysSection.js";
import { lazy } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/OrganizationProfile/APIKeys.tsx
const OrganizationAPIKeysPage = lazy(() => import("../../components/OrganizationProfile/OrganizationAPIKeysPage.js").then((m) => ({ default: m.OrganizationAPIKeysPage })));
const OrganizationProfileAPIKeysPanel = () => /* @__PURE__ */ jsx(APIKeysSection, { page: OrganizationAPIKeysPage });

//#endregion
export { OrganizationProfileAPIKeysPanel };
//# sourceMappingURL=APIKeys.js.map