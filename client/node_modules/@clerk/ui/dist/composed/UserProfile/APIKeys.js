'use client';

import { APIKeysSection } from "../APIKeysSection.js";
import { lazy } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/UserProfile/APIKeys.tsx
const APIKeysPage = lazy(() => import("../../components/UserProfile/APIKeysPage.js").then((m) => ({ default: m.APIKeysPage })));
const UserProfileAPIKeysPanel = () => /* @__PURE__ */ jsx(APIKeysSection, { page: APIKeysPage });

//#endregion
export { UserProfileAPIKeysPanel };
//# sourceMappingURL=APIKeys.js.map