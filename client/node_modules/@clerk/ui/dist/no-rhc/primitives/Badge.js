import { createVariants } from "../styledSystem/createVariants.js";
import { createCssVariables } from "../styledSystem/createCssVariables.js";
import { common } from "../styledSystem/common.js";
import { Flex } from "./Flex.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Badge.tsx
const vars = createCssVariables("accent", "bg", "borderColor");
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: {
		color: vars.accent,
		flexShrink: 0,
		backgroundColor: vars.bg,
		boxShadow: theme.shadows.$badge,
		borderWidth: theme.borderWidths.$normal,
		borderStyle: theme.borderStyles.$solid,
		borderColor: vars.borderColor,
		borderRadius: theme.radii.$sm,
		padding: `${theme.space.$0x25} ${theme.space.$1x5}`,
		display: "inline-flex",
		marginInlineEnd: "1px"
	},
	variants: {
		textVariant: { ...common.textVariants(theme) },
		colorScheme: {
			primary: {
				[vars.accent]: theme.colors.$borderAlpha600,
				[vars.bg]: theme.colors.$borderAlpha50,
				[vars.borderColor]: theme.colors.$borderAlpha150
			},
			secondary: {
				[vars.accent]: theme.colors.$colorPrimaryForeground,
				[vars.bg]: theme.colors.$primary500,
				[vars.borderColor]: theme.colors.$primary500
			},
			danger: {
				[vars.accent]: theme.colors.$danger500,
				[vars.bg]: theme.colors.$dangerAlpha50,
				[vars.borderColor]: theme.colors.$dangerAlpha300
			},
			success: {
				[vars.accent]: theme.colors.$success500,
				[vars.bg]: theme.colors.$successAlpha50,
				[vars.borderColor]: theme.colors.$successAlpha300
			},
			warning: {
				[vars.accent]: theme.colors.$warning500,
				[vars.bg]: theme.colors.$warningAlpha50,
				[vars.borderColor]: theme.colors.$warningAlpha300
			}
		}
	},
	defaultVariants: {
		colorScheme: "primary",
		textVariant: "caption"
	}
}));
const Badge = (props) => {
	return /* @__PURE__ */ jsx(Flex, {
		...filterProps(props),
		center: true,
		as: "span",
		css: applyVariants(props),
		"data-color": props.colorScheme || "primary"
	});
};

//#endregion
export { Badge };
//# sourceMappingURL=Badge.js.map