import { createVariants } from "../styledSystem/createVariants.js";
import { Box } from "./Box.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Grid.tsx
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: { display: "grid" },
	variants: {
		align: {
			start: { alignItems: "flex-start" },
			center: { alignItems: "center" },
			end: { alignItems: "flex-end" },
			stretch: { alignItems: "stretch" },
			baseline: { alignItems: "baseline" }
		},
		justify: {
			start: { justifyContent: "flex-start" },
			center: { justifyContent: "center" },
			end: { justifyContent: "flex-end" },
			between: { justifyContent: "space-between" },
			around: { justifyContent: "space-around" },
			stretch: { justifyContent: "stretch" }
		},
		columns: {
			1: { gridTemplateColumns: "1fr" },
			2: { gridTemplateColumns: "repeat(2, 1fr)" },
			3: { gridTemplateColumns: "repeat(3, 1fr)" },
			4: { gridTemplateColumns: "repeat(4, 1fr)" },
			6: { gridTemplateColumns: "repeat(6, 1fr)" }
		},
		gap: {
			1: { gap: theme.space.$1 },
			2: { gap: theme.space.$2 },
			3: { gap: theme.space.$3 },
			4: { gap: theme.space.$4 },
			5: { gap: theme.space.$5 },
			6: { gap: theme.space.$6 },
			7: { gap: theme.space.$7 },
			8: { gap: theme.space.$8 },
			9: { gap: theme.space.$9 }
		}
	},
	defaultVariants: {
		align: "stretch",
		justify: "stretch",
		wrap: "noWrap"
	}
}));
const Grid = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		...filterProps(props),
		css: applyVariants(props),
		ref
	});
});

//#endregion
export { Grid };
//# sourceMappingURL=Grid.js.map