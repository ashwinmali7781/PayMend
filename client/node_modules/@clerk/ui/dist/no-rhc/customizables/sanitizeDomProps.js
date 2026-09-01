import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/customizables/sanitizeDomProps.tsx
/**
* Removes any non-native attributes before the components gets committed to the DOM
* simply by destructuring the unwanted props out of `props`
*/
const sanitizeDomProps = (Component) => {
	return React.forwardRef((props, ref) => {
		const { elementId, elementDescriptor, localizationKey, getContainer, ...restProps } = props;
		return /* @__PURE__ */ jsx(Component, {
			...restProps,
			ref
		});
	});
};

//#endregion
export { sanitizeDomProps };
//# sourceMappingURL=sanitizeDomProps.js.map