import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Tbody.tsx
const Tbody = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "tbody",
		...props,
		ref
	});
});

//#endregion
export { Tbody };
//# sourceMappingURL=Tbody.js.map