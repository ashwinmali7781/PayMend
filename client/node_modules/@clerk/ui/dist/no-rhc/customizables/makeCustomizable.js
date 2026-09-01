import { useAppearance } from "./AppearanceContext.js";
import { appendEmojiSeparator, generateClassName } from "./classGeneration.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/customizables/makeCustomizable.tsx
const makeCustomizable = (Component, options) => {
	const { defaultStyles, defaultDescriptor } = options || {};
	const customizableComponent = React.forwardRef((props, ref) => {
		const { elementDescriptor, elementId, sx, className, ...restProps } = props;
		const { parsedElements } = useAppearance();
		const descriptors = [defaultDescriptor, ...Array.isArray(elementDescriptor) ? elementDescriptor : [elementDescriptor]].filter((s) => s);
		if (!descriptors.length) return /* @__PURE__ */ jsx(Component, {
			css: sx,
			...restProps,
			className,
			ref
		});
		const generatedStyles = generateClassName(parsedElements, descriptors, elementId, props);
		const generatedClassname = appendEmojiSeparator(generatedStyles.className, className);
		generatedStyles.css.unshift(defaultStyles, sx);
		return /* @__PURE__ */ jsx(Component, {
			elementId,
			css: generatedStyles.css,
			className: generatedClassname,
			...restProps,
			ref
		});
	});
	customizableComponent.displayName = `Customizable${Component.displayName || Component.name || "Component"}`.replace("_", "");
	return customizableComponent;
};

//#endregion
export { makeCustomizable };
//# sourceMappingURL=makeCustomizable.js.map