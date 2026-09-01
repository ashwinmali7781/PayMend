import { createVariants } from "../styledSystem/createVariants.js";
import { common } from "../styledSystem/common.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/Heading.tsx
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: {
		boxSizing: "border-box",
		color: `${theme.colors.$colorForeground}`,
		margin: 0,
		textWrap: "balance"
	},
	variants: { textVariant: { ...common.textVariants(theme) } },
	defaultVariants: {
		as: "h1",
		textVariant: "h1"
	}
}));
const Heading = (props) => {
	const { as: As = "h1", ...rest } = props;
	return /* @__PURE__ */ jsx(As, {
		...filterProps(rest),
		css: applyVariants(props)
	});
};

//#endregion
export { Heading };
//# sourceMappingURL=Heading.js.map