import { createVariants } from "../styledSystem/createVariants.js";
import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Hr.tsx
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: {
		border: "none",
		height: theme.space.$px,
		backgroundColor: theme.colors.$neutralAlpha100
	},
	variants: {}
}));
const Hr = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "hr",
		...filterProps(props),
		css: applyVariants(props),
		ref
	});
});

//#endregion
export { Hr };
//# sourceMappingURL=Hr.js.map