import { HavingTrouble } from "./HavingTrouble.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/withHavingTrouble.tsx
const withHavingTrouble = (Component, props) => {
	const [showHavingTrouble, setShowHavingTrouble] = React.useState(false);
	const toggleHavingTrouble = React.useCallback(() => setShowHavingTrouble((s) => !s), [setShowHavingTrouble]);
	if (showHavingTrouble) return /* @__PURE__ */ jsx(HavingTrouble, { onBackLinkClick: toggleHavingTrouble });
	return /* @__PURE__ */ jsx(Component, {
		...props,
		onHavingTroubleClick: toggleHavingTrouble
	});
};

//#endregion
export { withHavingTrouble };
//# sourceMappingURL=withHavingTrouble.js.map