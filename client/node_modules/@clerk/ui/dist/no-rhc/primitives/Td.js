import { createVariants } from "../styledSystem/createVariants.js";
import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Td.tsx
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: {
		fontSize: theme.fontSizes.$xs,
		fontWeight: theme.fontWeights.$normal,
		color: theme.colors.$colorForeground
	},
	variants: {}
}));
const Td = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "td",
		...filterProps(props),
		css: applyVariants(props),
		ref
	});
});

//#endregion
export { Td };
//# sourceMappingURL=Td.js.map