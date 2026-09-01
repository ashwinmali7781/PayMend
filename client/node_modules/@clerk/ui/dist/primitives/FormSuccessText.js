import SvgCheckmarkCircle from "../icons/checkmark-circle.js";
import { createVariants } from "../styledSystem/createVariants.js";
import { animations } from "../styledSystem/animations.js";
import { Text } from "./Text.js";
import { Icon } from "../customizables/index.js";
import React, { forwardRef } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/primitives/FormSuccessText.tsx
const { applyVariants } = createVariants((theme) => ({
	base: {
		marginTop: theme.sizes.$1x5,
		animation: `${animations.textInSmall} ${theme.transitionDuration.$fast}`,
		display: "flex",
		gap: theme.sizes.$1,
		position: "absolute",
		top: "0",
		textAlign: "start"
	},
	variants: {}
}));
const FormSuccessText = forwardRef((props, ref) => {
	const { children, ...rest } = props;
	return /* @__PURE__ */ jsxs(Text, {
		ref,
		colorScheme: "secondary",
		...rest,
		css: applyVariants(props),
		children: [/* @__PURE__ */ jsx(Icon, {
			colorScheme: "success",
			icon: SvgCheckmarkCircle
		}), children]
	});
});

//#endregion
export { FormSuccessText, applyVariants };
//# sourceMappingURL=FormSuccessText.js.map