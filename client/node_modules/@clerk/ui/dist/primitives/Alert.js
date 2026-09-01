import { createVariants } from "../styledSystem/createVariants.js";
import { common } from "../styledSystem/common.js";
import { Flex } from "./Flex.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Alert.tsx
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: {
		padding: `${theme.space.$3} ${theme.space.$4}`,
		backgroundColor: theme.colors.$neutralAlpha50,
		...common.borderVariants(theme, { hoverStyles: false }).normal
	},
	variants: { colorScheme: {
		danger: {
			color: theme.colors.$danger500,
			backgroundColor: theme.colors.$dangerAlpha50,
			...common.borderVariants(theme, { hasError: true }).normal
		},
		info: {
			color: theme.colors.$neutralAlpha150,
			background: theme.colors.$neutralAlpha50
		},
		warning: {
			backgroundColor: theme.colors.$warningAlpha100,
			...common.borderVariants(theme, {
				hasWarning: true,
				hoverStyles: false
			}).normal
		}
	} },
	defaultVariants: { colorScheme: "warning" }
}));
const Alert = (props) => {
	return /* @__PURE__ */ jsx(Flex, {
		align: "center",
		justify: "start",
		...filterProps(props),
		css: applyVariants(props),
		children: props.children
	});
};

//#endregion
export { Alert };
//# sourceMappingURL=Alert.js.map