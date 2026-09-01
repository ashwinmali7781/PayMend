import { createVariants } from "../styledSystem/createVariants.js";
import { common } from "../styledSystem/common.js";
import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Table.tsx
const { applyVariants, filterProps } = createVariants((theme) => {
	return {
		base: {
			borderSpacing: "0",
			borderCollapse: "separate",
			borderWidth: theme.borderWidths.$normal,
			borderStyle: theme.borderStyles.$solid,
			borderColor: theme.colors.$borderAlpha150,
			borderRadius: theme.radii.$lg,
			width: "100%",
			">:not([hidden])~:not([hidden])": {
				borderBottomWidth: "0px",
				borderTopWidth: "1px",
				borderStyle: "solid",
				borderInlineStartWidth: "0px",
				borderInlineEndWidth: "0px",
				borderColor: theme.colors.$borderAlpha150
			},
			"td:not(:first-of-type)": { paddingInlineStart: theme.space.$2 },
			"th:not(:first-of-type)": { paddingInlineStart: theme.space.$2 },
			"tr > td": {
				borderTopWidth: theme.borderWidths.$normal,
				borderTopStyle: theme.borderStyles.$solid,
				borderTopColor: theme.colors.$borderAlpha150,
				paddingBottom: theme.space.$2,
				paddingTop: theme.space.$2,
				paddingInlineStart: theme.space.$4,
				paddingInlineEnd: theme.space.$4
			},
			"tbody > :not([hidden])~:not([hidden])": {
				borderBottomWidth: "0px",
				borderTopWidth: "1px",
				borderStyle: "solid",
				borderInlineStartWidth: "0px",
				borderInlineEndWidth: "0px",
				borderColor: theme.colors.$borderAlpha150
			},
			"tr:last-of-type:hover td:first-of-type": { borderEndStartRadius: theme.radii.$lg },
			"tr:last-of-type:hover td:last-of-type": { borderEndEndRadius: theme.radii.$lg },
			"tr > th:first-of-type": { paddingInlineStart: theme.space.$5 },
			"thead::after": {
				content: "\"\"",
				display: "block"
			}
		},
		variants: { tableHeadVisuallyHidden: { true: {
			thead: { ...common.visuallyHidden() },
			"tr:first-of-type td": { borderTop: "none" }
		} } }
	};
});
const Table = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		as: "table",
		...filterProps(props),
		css: applyVariants(props),
		ref
	});
});

//#endregion
export { Table };
//# sourceMappingURL=Table.js.map