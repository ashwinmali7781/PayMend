import { createVariants } from "../styledSystem/createVariants.js";
import { common } from "../styledSystem/common.js";
import { applyDataStateProps } from "./applyDataStateProps.js";
import { useFormField } from "./hooks/useFormField.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/FormLabel.tsx
const { applyVariants } = createVariants((theme) => ({
	base: {
		color: theme.colors.$colorForeground,
		...common.textVariants(theme).subtitle,
		...common.disabled(theme)
	},
	variants: {}
}));
const FormLabel = (props) => {
	const { id: fieldHtmlId } = useFormField();
	const { isRequired, htmlFor: htmlForProp, ...rest } = props;
	return /* @__PURE__ */ jsx("label", {
		...applyDataStateProps(rest),
		htmlFor: htmlForProp ?? fieldHtmlId,
		css: applyVariants(props),
		children: props.children
	});
};

//#endregion
export { FormLabel };
//# sourceMappingURL=FormLabel.js.map