import SvgExclamationCircle from "../icons/exclamation-circle.js";
import { Text } from "./Text.js";
import { applyVariants } from "./FormSuccessText.js";
import { Icon } from "../customizables/index.js";
import { forwardRef } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/primitives/FormWarningText.tsx
const FormWarningText = forwardRef((props, ref) => {
	const { children, ...rest } = props;
	return /* @__PURE__ */ jsxs(Text, {
		ref,
		colorScheme: "secondary",
		...rest,
		css: applyVariants(props),
		children: [/* @__PURE__ */ jsx(Icon, {
			colorScheme: "warning",
			icon: SvgExclamationCircle
		}), children]
	});
});

//#endregion
export { FormWarningText };
//# sourceMappingURL=FormWarningText.js.map