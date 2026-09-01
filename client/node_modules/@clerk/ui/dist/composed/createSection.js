'use client';

import { useRequirePage } from "./useRequirePage.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/createSection.tsx
function createSection(name, Component) {
	function Section() {
		if (!useRequirePage(name)) return null;
		return /* @__PURE__ */ jsx(Component, {});
	}
	Section.displayName = name;
	return Section;
}

//#endregion
export { createSection };
//# sourceMappingURL=createSection.js.map