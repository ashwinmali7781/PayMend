import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Dl.tsx
const Dl = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "dl",
		css: { margin: 0 },
		...props,
		ref
	});
});

//#endregion
export { Dl };
//# sourceMappingURL=Dl.js.map