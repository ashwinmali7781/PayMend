import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Dd.tsx
const Dd = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "dd",
		css: { margin: 0 },
		...props,
		ref
	});
});

//#endregion
export { Dd };
//# sourceMappingURL=Dd.js.map