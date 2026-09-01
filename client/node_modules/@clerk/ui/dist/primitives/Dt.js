import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Dt.tsx
const Dt = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "dt",
		css: { margin: 0 },
		...props,
		ref
	});
});

//#endregion
export { Dt };
//# sourceMappingURL=Dt.js.map