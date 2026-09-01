import SvgTriangleRight from "../icons/triangle-right.js";
import { createVariants } from "../styledSystem/createVariants.js";
import { createCssVariables } from "../styledSystem/createCssVariables.js";
import { common } from "../styledSystem/common.js";
import { applyDataStateProps } from "./applyDataStateProps.js";
import { Flex } from "./Flex.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Icon, Spinner } from "../customizables/index.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/primitives/Button.tsx
const vars = createCssVariables("accent", "accentHover", "accentContrast", "alpha", "border");
const { applyVariants, filterProps } = createVariants((theme, props) => {
	return {
		base: {
			margin: 0,
			padding: 0,
			borderWidth: 0,
			outline: 0,
			userSelect: "none",
			cursor: "pointer",
			backgroundColor: "unset",
			color: "currentColor",
			borderRadius: theme.radii.$md,
			position: "relative",
			isolation: "isolate",
			...common.centeredFlex("inline-flex"),
			...common.disabled(theme),
			transitionProperty: theme.transitionProperty.$common,
			transitionDuration: theme.transitionDuration.$controls
		},
		variants: {
			textVariant: common.textVariants(theme),
			size: {
				iconLg: { width: theme.sizes.$13 },
				xs: { padding: `${theme.space.$1} ${theme.space.$3}` },
				sm: { padding: `${theme.space.$1x75} ${theme.space.$3}` },
				md: { padding: `${theme.space.$2x5} ${theme.space.$5}` }
			},
			colorScheme: {
				primary: {
					[vars.accent]: theme.colors.$primary500,
					[vars.accentHover]: theme.colors.$primaryHover,
					[vars.border]: theme.colors.$primary500,
					[vars.accentContrast]: theme.colors.$colorPrimaryForeground,
					[vars.alpha]: theme.colors.$neutralAlpha50
				},
				secondary: {
					[vars.accent]: theme.colors.$colorBackground,
					[vars.accentHover]: `color-mix(in srgb, ${vars.accent}, ${theme.colors.$neutralAlpha50})`,
					[vars.border]: theme.colors.$primary500,
					[vars.accentContrast]: theme.colors.$colorForeground,
					[vars.alpha]: theme.colors.$neutralAlpha50
				},
				neutral: {
					[vars.accent]: theme.colors.$neutralAlpha600,
					[vars.accentHover]: theme.colors.$neutralAlpha700,
					[vars.border]: theme.colors.$neutralAlpha200,
					[vars.accentContrast]: theme.colors.$white,
					[vars.alpha]: theme.colors.$neutralAlpha50
				},
				danger: {
					[vars.accent]: theme.colors.$danger500,
					[vars.accentHover]: theme.colors.$danger600,
					[vars.accentContrast]: theme.colors.$white,
					[vars.border]: theme.colors.$danger500,
					[vars.alpha]: theme.colors.$dangerAlpha50
				}
			},
			variant: {
				solid: {
					backgroundColor: vars.accent,
					color: vars.accentContrast,
					borderWidth: theme.borderWidths.$normal,
					borderStyle: theme.borderStyles.$solid,
					borderColor: vars.accent,
					"&:hover": { backgroundColor: vars.accentHover },
					"&:focus-visible": props.hoverAsFocus ? { backgroundColor: vars.accentHover } : void 0
				},
				outline: {
					borderWidth: theme.borderWidths.$normal,
					borderStyle: theme.borderStyles.$solid,
					borderColor: theme.colors.$borderAlpha150,
					color: theme.colors.$neutralAlpha600,
					"&:hover": { backgroundColor: theme.colors.$neutralAlpha50 },
					"&:focus-visible": props.hoverAsFocus ? {
						backgroundColor: theme.colors.$neutralAlpha50,
						borderColor: theme.colors.$borderAlpha300
					} : void 0
				},
				bordered: {
					borderWidth: theme.borderWidths.$normal,
					borderStyle: theme.borderStyles.$solid,
					borderColor: theme.colors.$borderAlpha150,
					color: vars.accentContrast,
					backgroundColor: vars.accent,
					"&:hover": { backgroundColor: vars.accentHover },
					"&:focus-visible": props.hoverAsFocus ? {
						backgroundColor: vars.accentHover,
						borderColor: theme.colors.$borderAlpha300
					} : void 0
				},
				ghost: {
					color: vars.accent,
					"&:hover": {
						backgroundColor: vars.alpha,
						color: vars.accentHover
					},
					"&:focus-visible": props.hoverAsFocus ? {
						backgroundColor: vars.alpha,
						color: vars.accentHover
					} : void 0
				},
				link: {
					minHeight: "fit-content",
					height: "fit-content",
					width: "fit-content",
					textTransform: "none",
					padding: 0,
					color: theme.colors.$primary500,
					"&:hover": { textDecoration: "underline" },
					"&:focus-visible": props.hoverAsFocus ? { textDecoration: "underline" } : void 0
				},
				linkDanger: {
					minHeight: "fit-content",
					height: "fit-content",
					width: "fit-content",
					textTransform: "none",
					padding: 0,
					color: theme.colors.$danger500,
					"&:hover": { textDecoration: "underline" },
					"&:focus-visible": props.hoverAsFocus ? { textDecoration: "underline" } : void 0
				},
				unstyled: {},
				roundWrapper: {
					padding: 0,
					margin: 0,
					height: "unset",
					width: "unset",
					minHeight: "unset"
				}
			},
			block: { true: { width: "100%" } },
			focusRing: { true: { ...common.focusRing(theme) } }
		},
		defaultVariants: {
			textVariant: "buttonLarge",
			variant: "solid",
			colorScheme: "primary",
			size: "sm",
			focusRing: true
		}
	};
});
const ButtonChildrenWithArrow = ({ children }) => {
	return /* @__PURE__ */ jsxs(Flex, {
		align: "center",
		as: "span",
		children: [children, /* @__PURE__ */ jsx(Icon, {
			elementDescriptor: descriptors.buttonArrowIcon,
			icon: SvgTriangleRight,
			sx: (t) => ({
				marginInlineStart: t.space.$2,
				width: t.sizes.$4,
				height: t.sizes.$4,
				opacity: t.opacity.$inactive,
				"[dir=\"rtl\"] &": { transform: "scaleX(-1)" }
			})
		})]
	});
};
const Button = React.forwardRef((props, ref) => {
	const parsedProps = {
		...props,
		isDisabled: props.isDisabled || props.isLoading
	};
	const { isLoading, isDisabled, hoverAsFocus, loadingText, children, hasArrow, onClick: onClickProp, ...rest } = filterProps(parsedProps);
	const onClick = (e) => {
		if (rest.type !== "submit") e.preventDefault();
		return onClickProp?.(e);
	};
	return /* @__PURE__ */ jsxs("button", {
		...applyDataStateProps(rest),
		type: void 0,
		onClick,
		disabled: isDisabled,
		"data-variant": props.variant || "solid",
		"data-color": props.colorScheme || "primary",
		css: applyVariants(parsedProps),
		ref,
		children: [isLoading && /* @__PURE__ */ jsxs(Flex, {
			as: "span",
			gap: 2,
			center: true,
			css: { position: "relative" },
			children: [/* @__PURE__ */ jsx(Spinner, {
				"aria-label": loadingText || "Loading",
				elementDescriptor: descriptors.spinner,
				sx: { position: loadingText ? void 0 : "absolute" }
			}), loadingText || /* @__PURE__ */ jsx("span", {
				style: {
					display: "inline-flex",
					visibility: "hidden"
				},
				children
			})]
		}), !isLoading && (hasArrow ? /* @__PURE__ */ jsx(ButtonChildrenWithArrow, { children }) : children)]
	});
});
const SimpleButton = React.forwardRef((props, ref) => {
	const parsedProps = {
		...props,
		isDisabled: props.isDisabled || props.isLoading
	};
	const { loadingText, isDisabled, hoverAsFocus, children, onClick: onClickProp, ...rest } = filterProps(parsedProps);
	const onClick = (e) => {
		if (rest.type !== "submit") e.preventDefault();
		return onClickProp?.(e);
	};
	return /* @__PURE__ */ jsx("button", {
		...applyDataStateProps(rest),
		type: void 0,
		onClick,
		css: applyVariants(parsedProps),
		disabled: isDisabled,
		"data-variant": props.variant || "solid",
		"data-color": props.colorScheme || "primary",
		ref,
		children
	});
});

//#endregion
export { Button, SimpleButton };
//# sourceMappingURL=Button.js.map