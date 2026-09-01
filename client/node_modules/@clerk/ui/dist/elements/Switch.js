import { common } from "../styledSystem/common.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, Text } from "../customizables/index.js";
import React, { forwardRef, useState } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Switch.tsx
const Switch = forwardRef(({ id, isChecked: controlledChecked, defaultChecked, onChange, isDisabled = false, label, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }, ref) => {
	const [internalChecked, setInternalChecked] = useState(!!defaultChecked);
	const isControlled = controlledChecked !== void 0;
	const checked = isControlled ? controlledChecked : internalChecked;
	const handleChange = (e) => {
		if (isDisabled) return;
		if (!isControlled) setInternalChecked(e.target.checked);
		onChange?.(e.target.checked);
	};
	const hasInternalLabel = label !== void 0;
	return /* @__PURE__ */ jsxs(Flex, {
		ref,
		elementDescriptor: descriptors.switchRoot,
		direction: "row",
		align: "center",
		as: "label",
		sx: (t) => ({
			position: "relative",
			isolation: "isolate",
			width: "fit-content",
			"&:has(input:focus-visible) > input + span": { ...common.focusRingStyles(t) }
		}),
		children: [
			/* @__PURE__ */ jsx("input", {
				id,
				type: "checkbox",
				role: "switch",
				disabled: isDisabled,
				defaultChecked,
				checked,
				onChange: handleChange,
				"aria-label": ariaLabel,
				"aria-labelledby": ariaLabelledBy,
				style: {
					...common.visuallyHidden(),
					inset: 0
				}
			}),
			/* @__PURE__ */ jsx(Flex, {
				elementDescriptor: descriptors.switchIndicator,
				as: "span",
				"data-checked": checked,
				sx: (t) => ({
					width: t.sizes.$6,
					height: t.sizes.$4,
					alignItems: "center",
					position: "relative",
					backgroundColor: checked ? t.colors.$primary500 : t.colors.$neutralAlpha150,
					borderRadius: 999,
					transition: "background-color 0.2s",
					opacity: isDisabled ? .6 : 1,
					cursor: isDisabled ? "not-allowed" : "pointer",
					outline: "none",
					boxSizing: "border-box",
					boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.06) inset"
				}),
				children: /* @__PURE__ */ jsx(Flex, {
					as: "span",
					elementDescriptor: descriptors.switchThumb,
					sx: (t) => ({
						position: "absolute",
						left: t.sizes.$0x5,
						width: t.sizes.$3,
						height: t.sizes.$3,
						borderRadius: "50%",
						backgroundColor: t.colors.$colorBackground,
						boxShadow: t.shadows.$switchControl,
						transform: `translateX(${checked ? t.sizes.$2 : 0})`,
						transition: "transform 0.2s",
						zIndex: 1
					})
				})
			}),
			hasInternalLabel ? /* @__PURE__ */ jsx(Text, {
				as: "span",
				variant: "caption",
				colorScheme: "secondary",
				localizationKey: label,
				sx: (t) => ({
					paddingInlineStart: t.sizes.$2,
					cursor: isDisabled ? "not-allowed" : "pointer",
					userSelect: "none"
				})
			}) : null
		]
	});
});
Switch.displayName = "Switch";

//#endregion
export { Switch };
//# sourceMappingURL=Switch.js.map