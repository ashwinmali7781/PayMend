import { createVariants } from "../styledSystem/createVariants.js";
import { Box } from "./Box.js";
import { createFlexGapPropertyIosCompat } from "./gapPropertyCompat.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Flex.tsx
const { applyVariants, filterProps } = createVariants((theme, props) => {
	const dir = props.flexDirection === "col" || props.flexDirection === "colReverse" || props.direction === "col" || props.direction === "colReverse" ? "col" : "row";
	return {
		base: { display: "flex" },
		variants: {
			direction: {
				row: { flexDirection: "row" },
				col: { flexDirection: "column" },
				rowReverse: { flexDirection: "row-reverse" },
				columnReverse: { flexDirection: "column-reverse" }
			},
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
				between: { justifyContent: "space-between" }
			},
			wrap: {
				noWrap: { flexWrap: "nowrap" },
				wrap: { flexWrap: "wrap" },
				wrapReverse: { flexWrap: "wrap-reverse" }
			},
			gap: {
				1: createFlexGapPropertyIosCompat(theme.space.$1, dir),
				2: createFlexGapPropertyIosCompat(theme.space.$2, dir),
				3: createFlexGapPropertyIosCompat(theme.space.$3, dir),
				4: createFlexGapPropertyIosCompat(theme.space.$4, dir),
				5: createFlexGapPropertyIosCompat(theme.space.$5, dir),
				6: createFlexGapPropertyIosCompat(theme.space.$6, dir),
				7: createFlexGapPropertyIosCompat(theme.space.$7, dir),
				8: createFlexGapPropertyIosCompat(theme.space.$8, dir),
				9: createFlexGapPropertyIosCompat(theme.space.$9, dir)
			},
			center: { true: {
				justifyContent: "center",
				alignItems: "center"
			} }
		},
		defaultVariants: {
			direction: "row",
			align: "stretch",
			justify: "start",
			wrap: "noWrap"
		}
	};
});
const Flex = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		...filterProps(props),
		css: applyVariants(props),
		ref
	});
});
const Col = React.forwardRef((props, ref) => {
	return /* @__PURE__ */ jsx(Flex, {
		...props,
		direction: "col",
		ref
	});
});

//#endregion
export { Col, Flex };
//# sourceMappingURL=Flex.js.map