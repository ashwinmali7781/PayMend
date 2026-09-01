import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, SimpleButton } from "../customizables/index.js";
import React, { createContext, useContext, useState } from "react";
import { jsx } from "@emotion/react/jsx-runtime";
import { Composite, CompositeItem } from "@floating-ui/react";

//#region src/elements/SegmentedControl.tsx
const SegmentedControlContext = createContext(null);
function useSegmentedControlContext() {
	const context = useContext(SegmentedControlContext);
	if (!context) throw new Error("SegmentedControl.Button must be used within SegmentedControl.Root");
	return context;
}
const Root = React.forwardRef(({ children, value: controlledValue, defaultValue, onChange, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, size = "md", fullWidth = false, sx }, ref) => {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const isControlled = controlledValue !== void 0;
	const currentValue = isControlled ? controlledValue : internalValue;
	const handleValueChange = (newValue) => {
		if (!isControlled) setInternalValue(newValue);
		onChange?.(newValue);
	};
	return /* @__PURE__ */ jsx(SegmentedControlContext.Provider, {
		value: {
			currentValue,
			onValueChange: handleValueChange,
			size,
			fullWidth
		},
		children: /* @__PURE__ */ jsx(Composite, {
			orientation: "horizontal",
			role: "radiogroup",
			loop: false,
			render: /* @__PURE__ */ jsx(Flex, {
				ref,
				elementDescriptor: descriptors.segmentedControlRoot,
				"aria-label": ariaLabel,
				"aria-labelledby": ariaLabelledby,
				sx: [(t) => ({
					backgroundColor: t.colors.$neutralAlpha50,
					borderRadius: t.radii.$md,
					borderWidth: t.borderWidths.$normal,
					borderStyle: t.borderStyles.$solid,
					borderColor: t.colors.$borderAlpha100,
					isolation: "isolate"
				}), sx]
			}),
			children
		})
	});
});
Root.displayName = "SegmentedControl.Root";
const Button = React.forwardRef(({ text, value }, ref) => {
	const { currentValue, onValueChange, size, fullWidth } = useSegmentedControlContext();
	const isSelected = value === currentValue;
	return /* @__PURE__ */ jsx(CompositeItem, { render: (compProps) => {
		return /* @__PURE__ */ jsx(SimpleButton, {
			ref,
			...compProps,
			localizationKey: text,
			elementDescriptor: descriptors.segmentedControlButton,
			variant: "unstyled",
			role: "radio",
			"aria-checked": isSelected,
			onClick: () => onValueChange(value),
			isActive: isSelected,
			sx: (t) => ({
				position: "relative",
				width: fullWidth ? "100%" : "auto",
				backgroundColor: isSelected ? t.colors.$colorBackground : "transparent",
				color: isSelected ? t.colors.$colorForeground : t.colors.$colorMutedForeground,
				fontSize: size === "lg" ? t.fontSizes.$md : t.fontSizes.$xs,
				minHeight: t.sizes.$6,
				boxShadow: isSelected ? t.shadows.$segmentedControl : "none",
				borderRadius: `calc(${t.radii.$md} - ${t.borderWidths.$normal})`,
				zIndex: 1,
				":focus-visible": { zIndex: 2 }
			})
		});
	} });
});
Button.displayName = "SegmentedControl.Button";
const SegmentedControl = {
	Root,
	Button
};

//#endregion
export { SegmentedControl };
//# sourceMappingURL=SegmentedControl.js.map