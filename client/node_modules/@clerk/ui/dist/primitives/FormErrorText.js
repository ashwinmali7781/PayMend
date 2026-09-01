import SvgExclamationCircle from "../icons/exclamation-circle.js";
import { createVariants } from "../styledSystem/createVariants.js";
import { animations } from "../styledSystem/animations.js";
import { useFormField } from "./hooks/useFormField.js";
import { Text } from "./Text.js";
import { Icon } from "../customizables/index.js";
import React, { forwardRef } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/primitives/FormErrorText.tsx
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
const FormErrorText = forwardRef((props, ref) => {
	const { hasError } = useFormField() || {};
	if (!hasError && !props.children) return null;
	const { children, ...rest } = props;
	return /* @__PURE__ */ jsxs(Text, {
		ref,
		colorScheme: "danger",
		...rest,
		css: applyVariants(props),
		children: [/* @__PURE__ */ jsx(Icon, {
			colorScheme: "danger",
			icon: SvgExclamationCircle
		}), children]
	});
});

//#endregion
export { FormErrorText };
//# sourceMappingURL=FormErrorText.js.map