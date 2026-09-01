'use client';

import { CardStateProvider } from "../elements/contexts/index.js";
import { Suspense } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/APIKeysSection.tsx
function APIKeysSection({ page: Page }) {
	return /* @__PURE__ */ jsx(CardStateProvider, { children: /* @__PURE__ */ jsx(Suspense, {
		fallback: null,
		children: /* @__PURE__ */ jsx(Page, {})
	}) });
}

//#endregion
export { APIKeysSection };
//# sourceMappingURL=APIKeysSection.js.map