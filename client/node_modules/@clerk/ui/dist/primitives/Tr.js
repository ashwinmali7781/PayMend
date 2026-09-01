import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Tr.tsx
const Tr = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "tr",
		...props,
		ref
	});
});

//#endregion
export { Tr };
//# sourceMappingURL=Tr.js.map