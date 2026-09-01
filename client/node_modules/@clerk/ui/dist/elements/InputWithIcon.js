import SvgClose from "../icons/close.js";
import { common } from "../styledSystem/common.js";
import { Box, Flex, Input } from "../customizables/index.js";
import { IconButton } from "./IconButton.js";
import { mergeRefs } from "../utils/mergeRefs.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { inertProps } from "@clerk/shared/inert";
import { isVirtualClick } from "@floating-ui/react/utils";

//#region src/elements/InputWithIcon.tsx
const InputWithIcon = React.forwardRef((props, ref) => {
	const { leftIcon, sx, onClear, clearButtonLabel, clearButtonElementDescriptor, ...rest } = props;
	const internalRef = React.useRef(null);
	const hasClearButton = Boolean(onClear);
	const hasValue = rest.value != null && rest.value !== "";
	const handleClear = (event) => {
		onClear?.();
		if (isVirtualClick(event.nativeEvent)) internalRef.current?.focus({ preventScroll: true });
	};
	return /* @__PURE__ */ jsxs(Flex, {
		center: true,
		sx: {
			width: "100%",
			position: "relative"
		},
		children: [
			leftIcon ? /* @__PURE__ */ jsx(Box, {
				sx: (theme) => [{
					position: "absolute",
					insetInlineStart: theme.space.$3x5,
					width: theme.sizes.$3x5,
					height: theme.sizes.$3x5,
					pointerEvents: "none",
					display: "grid",
					placeContent: "center",
					"& svg": {
						position: "absolute",
						width: "100%",
						height: "100%"
					}
				}],
				children: leftIcon
			}) : null,
			/* @__PURE__ */ jsx(Input, {
				...rest,
				sx: [
					(theme) => ({
						width: "100%",
						paddingInlineStart: theme.space.$10
					}),
					hasClearButton ? (theme) => ({
						paddingInlineEnd: theme.space.$10,
						"::-webkit-search-cancel-button": { display: "none" }
					}) : void 0,
					sx
				],
				ref: hasClearButton ? mergeRefs(ref, internalRef) : ref
			}),
			hasClearButton ? /* @__PURE__ */ jsx(IconButton, {
				icon: SvgClose,
				"aria-label": clearButtonLabel ?? "Clear",
				variant: "ghost",
				size: "xs",
				onClick: handleClear,
				...inertProps(!hasValue),
				elementDescriptor: clearButtonElementDescriptor,
				sx: (theme) => ({
					...common.inputTrailingButton(theme),
					opacity: hasValue ? 1 : 0,
					transition: `opacity ${theme.transitionDuration.$fast} ${theme.transitionTiming.$common}`
				})
			}) : null
		]
	});
});

//#endregion
export { InputWithIcon };
//# sourceMappingURL=InputWithIcon.js.map