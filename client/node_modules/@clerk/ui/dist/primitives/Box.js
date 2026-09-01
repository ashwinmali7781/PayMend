import { createVariants } from "../styledSystem/createVariants.js";
import { applyDataStateProps } from "./applyDataStateProps.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Box.tsx
const { applyVariants } = createVariants(() => ({
	base: { boxSizing: "border-box" },
	variants: {}
}));
const Box = React.forwardRef((props, ref) => {
	const { as: As = "div", ...rest } = props;
	return /* @__PURE__ */ jsx(As, {
		...applyDataStateProps(rest),
		css: applyVariants(props),
		ref
	});
});

//#endregion
export { Box };
//# sourceMappingURL=Box.js.map