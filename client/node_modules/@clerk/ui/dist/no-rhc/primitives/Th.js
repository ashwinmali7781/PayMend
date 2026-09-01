import { colors } from "../utils/colors/index.js";
import { createVariants } from "../styledSystem/createVariants.js";
import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Th.tsx
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: {
		textAlign: "start",
		fontSize: theme.fontSizes.$sm,
		fontWeight: theme.fontWeights.$normal,
		color: colors.setAlpha(theme.colors.$colorForeground, .62),
		padding: `${theme.space.$2} ${theme.space.$4}`
	},
	variants: {}
}));
const Th = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "th",
		...filterProps(props),
		css: applyVariants(props),
		ref
	});
});

//#endregion
export { Th };
//# sourceMappingURL=Th.js.map