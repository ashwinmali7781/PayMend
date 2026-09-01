import { useFormField } from "./hooks/useFormField.js";
import { Text } from "./Text.js";
import { applyVariants } from "./FormSuccessText.js";
import { forwardRef } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/primitives/FormInfoText.tsx
const FormInfoText = forwardRef((props, ref) => {
	const { hasError } = useFormField() || {};
	if (!hasError && !props.children) return null;
	return /* @__PURE__ */ jsx(Text, {
		ref,
		colorScheme: "secondary",
		...props,
		css: applyVariants(props)
	});
});

//#endregion
export { FormInfoText };
//# sourceMappingURL=FormInfoText.js.map