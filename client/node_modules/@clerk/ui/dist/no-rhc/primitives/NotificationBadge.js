import { createVariants } from "../styledSystem/createVariants.js";
import { createCssVariables } from "../styledSystem/createCssVariables.js";
import { common } from "../styledSystem/common.js";
import { Flex } from "./Flex.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/NotificationBadge.tsx
const vars = createCssVariables("accent", "bg", "borderColor");
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: {
		color: vars.accent,
		background: vars.bg,
		borderWidth: theme.borderWidths.$normal,
		borderStyle: theme.borderStyles.$solid,
		borderRadius: theme.radii.$lg,
		borderColor: vars.borderColor,
		height: theme.space.$4,
		minWidth: theme.space.$5,
		padding: `${theme.space.$0x5} ${theme.space.$1}`,
		display: "inline-flex"
	},
	variants: {
		textVariant: { ...common.textVariants(theme) },
		colorScheme: {
			primary: {
				[vars.accent]: theme.colors.$colorPrimaryForeground,
				[vars.bg]: `linear-gradient(180deg, ${theme.colors.$whiteAlpha300} 0%, ${theme.colors.$transparent} 100%), ${theme.colors.$primary500}`,
				borderWidth: 0
			},
			outline: {
				[vars.accent]: theme.colors.$neutralAlpha600,
				[vars.bg]: "transparent",
				[vars.borderColor]: theme.colors.$borderAlpha150
			}
		}
	},
	defaultVariants: {
		colorScheme: "primary",
		textVariant: "caption"
	}
}));
const NotificationBadge = (props) => {
	return /* @__PURE__ */ jsx(Flex, {
		...filterProps(props),
		center: true,
		as: "span",
		css: [applyVariants(props), { lineHeight: 0 }]
	});
};

//#endregion
export { NotificationBadge };
//# sourceMappingURL=NotificationBadge.js.map