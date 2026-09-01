import SvgExclamationTriangle from "../icons/exclamation-triangle.js";
import SvgInformationCircle from "../icons/information-circle.js";
import { createVariants } from "../styledSystem/createVariants.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/AlertIcon.tsx
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: {
		marginInlineEnd: theme.space.$2x5,
		width: theme.sizes.$4,
		height: theme.sizes.$4
	},
	variants: { colorScheme: {
		danger: { color: theme.colors.$danger500 },
		warning: { color: theme.colors.$warning500 },
		success: { color: theme.colors.$success500 },
		primary: { color: theme.colors.$primary500 },
		info: { color: theme.colors.$colorMutedForeground }
	} }
}));
const AlertIcon = (props) => {
	const { variant, ...rest } = props;
	const Icon = {
		warning: SvgExclamationTriangle,
		danger: SvgExclamationTriangle,
		primary: SvgInformationCircle,
		info: SvgInformationCircle
	}[variant];
	return /* @__PURE__ */ jsx(Icon, {
		...filterProps(rest),
		css: applyVariants(props)
	});
};

//#endregion
export { AlertIcon };
//# sourceMappingURL=AlertIcon.js.map