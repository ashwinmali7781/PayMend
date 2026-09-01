import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Thead.tsx
const Thead = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "thead",
		...props,
		ref
	});
});

//#endregion
export { Thead };
//# sourceMappingURL=Thead.js.map