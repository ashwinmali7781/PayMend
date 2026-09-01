import SvgArrowRight from "../icons/arrow-right.js";
import { Flex, Icon, SimpleButton, Spinner, Text } from "../customizables/index.js";
import React, { isValidElement } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/ArrowBlockButton.tsx
const ArrowBlockButton = React.forwardRef((props, ref) => {
	const { rightIcon = SvgArrowRight, rightIconSx, leftIcon, leftIconSx, leftIconElementId, leftIconElementDescriptor, isLoading, children, textElementDescriptor, textElementId, spinnerElementDescriptor, spinnerElementId, arrowElementDescriptor, arrowElementId, textLocalizationKey, childrenSx, badge, textVariant = "buttonSmall", ...rest } = props;
	const isIconElement = isValidElement(leftIcon);
	return /* @__PURE__ */ jsxs(SimpleButton, {
		variant: "outline",
		block: true,
		isLoading,
		...rest,
		ref,
		sx: (theme) => [{
			gap: theme.space.$2,
			position: "relative",
			justifyContent: "center",
			borderColor: theme.colors.$neutralAlpha100,
			alignItems: "center",
			padding: `${theme.space.$1x5} ${theme.space.$3} ${theme.space.$1x5} ${theme.space.$2x5}`,
			"--arrow-opacity": "0",
			"--arrow-transform": `translateX(-${theme.space.$2})`,
			"&:hover,&:focus-visible ": {
				"--arrow-opacity": "0.5",
				"--arrow-transform": "translateX(0px)"
			},
			"[dir=\"rtl\"] &": { "--arrow-transform": `translateX(${theme.space.$2})` },
			"[dir=\"rtl\"] &:hover, [dir=\"rtl\"] &:focus-visible": { "--arrow-transform": "translateX(0px)" }
		}, props.sx],
		children: [
			(isLoading || leftIcon) && /* @__PURE__ */ jsx(Flex, {
				as: "span",
				sx: (theme) => ({
					width: theme.space.$4,
					height: theme.space.$4,
					flex: "none",
					alignItems: "center"
				}),
				children: isLoading ? /* @__PURE__ */ jsx(Spinner, {
					elementDescriptor: spinnerElementDescriptor,
					elementId: spinnerElementId,
					size: "md"
				}) : !isIconElement && leftIcon ? /* @__PURE__ */ jsx(Icon, {
					elementDescriptor: leftIconElementDescriptor,
					elementId: leftIconElementId,
					icon: leftIcon,
					sx: [(theme) => ({
						width: theme.sizes.$4,
						transform: "translateZ(0)"
					}), leftIconSx]
				}) : leftIcon
			}),
			/* @__PURE__ */ jsxs(Flex, {
				gap: 2,
				as: "span",
				sx: [{ overflow: "hidden" }, childrenSx],
				children: [/* @__PURE__ */ jsx(Text, {
					elementDescriptor: textElementDescriptor,
					elementId: textElementId,
					as: "span",
					truncate: true,
					variant: textVariant,
					localizationKey: textLocalizationKey,
					children
				}), badge]
			}),
			rightIcon && /* @__PURE__ */ jsx(Icon, {
				elementDescriptor: arrowElementDescriptor,
				elementId: arrowElementId,
				icon: rightIcon,
				sx: [(theme) => ({
					transition: "all 100ms ease",
					minWidth: theme.sizes.$4,
					minHeight: theme.sizes.$4,
					width: "1em",
					height: "1em",
					opacity: `var(--arrow-opacity)`,
					transform: `var(--arrow-transform)`,
					"[dir=\"rtl\"] &": { transform: `var(--arrow-transform) scaleX(-1)` }
				}), rightIconSx]
			})
		]
	});
});

//#endregion
export { ArrowBlockButton };
//# sourceMappingURL=ArrowBlockButton.js.map