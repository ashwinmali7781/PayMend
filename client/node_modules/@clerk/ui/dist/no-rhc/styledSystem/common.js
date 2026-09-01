import { clerkCssVar } from "../utils/cssVariables.js";
import { colors } from "../utils/colors/index.js";

//#region src/styledSystem/common.ts
const textVariants = (t) => {
	const base = {
		fontFamily: "inherit",
		letterSpacing: t.letterSpacings.$normal
	};
	return {
		h1: {
			...base,
			fontWeight: t.fontWeights.$semibold,
			fontSize: t.fontSizes.$xl,
			lineHeight: t.lineHeights.$extraSmall
		},
		h2: {
			...base,
			fontWeight: t.fontWeights.$bold,
			fontSize: t.fontSizes.$lg,
			lineHeight: t.lineHeights.$medium
		},
		h3: {
			...base,
			fontWeight: t.fontWeights.$bold,
			fontSize: t.fontSizes.$md,
			lineHeight: t.lineHeights.$small
		},
		subtitle: {
			...base,
			fontWeight: t.fontWeights.$medium,
			fontSize: t.fontSizes.$md,
			lineHeight: t.lineHeights.$small
		},
		body: {
			...base,
			fontWeight: t.fontWeights.$normal,
			fontSize: t.fontSizes.$md,
			lineHeight: t.lineHeights.$small
		},
		caption: {
			...base,
			fontWeight: t.fontWeights.$medium,
			fontSize: t.fontSizes.$xs,
			lineHeight: t.lineHeights.$large
		},
		buttonLarge: {
			...base,
			fontWeight: t.fontWeights.$medium,
			fontSize: t.fontSizes.$md,
			lineHeight: t.lineHeights.$small,
			fontFamily: t.fonts.$buttons
		},
		buttonSmall: {
			...base,
			fontWeight: t.fontWeights.$medium,
			fontSize: t.fontSizes.$sm,
			lineHeight: t.lineHeights.$extraSmall,
			fontFamily: t.fonts.$buttons
		}
	};
};
const borderVariants = (t, props) => {
	const hoverBorderColor = !props?.hasError ? t.colors.$borderAlpha300 : t.colors.$dangerAlpha500;
	const hoverBoxShadow = t.shadows.$input.replace("{{color}}", !props?.hasError ? t.colors.$borderAlpha150 : t.colors.$dangerAlpha200);
	const hoverStyles = props?.hoverStyles === false ? {} : { "&:hover": {
		WebkitTapHighlightColor: "transparent",
		borderColor: hoverBorderColor,
		boxShadow: hoverBoxShadow
	} };
	const borderColor = !props?.hasError ? !props?.hasWarning ? t.colors.$borderAlpha150 : t.colors.$warningAlpha300 : t.colors.$dangerAlpha500;
	const boxShadow = !props?.hasError ? !props?.hasWarning ? t.colors.$borderAlpha100 : t.colors.$warningAlpha50 : t.colors.$borderAlpha150;
	const defaultBoxShadow = t.shadows.$input.replace("{{color}}", boxShadow);
	const focusStyleValues = {
		borderColor: hoverBorderColor,
		WebkitTapHighlightColor: "transparent",
		boxShadow: [hoverBoxShadow, t.shadows.$focusRing.replace("{{color}}", !props?.hasError ? t.colors.$borderAlpha150 : t.colors.$dangerAlpha200)].toString()
	};
	const focusStyles = props?.focusRing === false ? {} : {
		"&:focus": focusStyleValues,
		"&:focus:not(:focus-visible)": {
			borderColor,
			boxShadow: defaultBoxShadow
		},
		"&:focus-visible": focusStyleValues
	};
	return { normal: {
		borderRadius: t.radii.$md,
		borderWidth: t.borderWidths.$normal,
		borderStyle: t.borderStyles.$solid,
		borderColor,
		boxShadow: defaultBoxShadow,
		transitionProperty: t.transitionProperty.$common,
		transitionTimingFunction: t.transitionTiming.$common,
		transitionDuration: t.transitionDuration.$focusRing,
		...hoverStyles,
		...focusStyles
	} };
};
const borderColor = (t, props) => {
	return { borderColor: props?.hasError ? t.colors.$dangerAlpha500 : t.colors.$borderAlpha150 };
};
const focusRingStyles = (t) => {
	return {
		"&::-moz-focus-inner": { border: "0" },
		WebkitTapHighlightColor: "transparent",
		boxShadow: t.shadows.$focusRing.replace("{{color}}", t.colors.$colorRing),
		transitionProperty: t.transitionProperty.$common,
		transitionTimingFunction: t.transitionTiming.$common,
		transitionDuration: t.transitionDuration.$focusRing
	};
};
const focusRing = (t) => {
	return {
		"&:focus": { ...focusRingStyles(t) },
		"&:focus:not(:focus-visible)": { boxShadow: "none" },
		"&:focus-visible": { ...focusRingStyles(t) }
	};
};
const disabled = (t) => {
	return { "&:disabled,&[data-disabled]": {
		cursor: "not-allowed",
		pointerEvents: "none",
		opacity: t.opacity.$disabled
	} };
};
const inputTrailingButton = (t) => ({
	position: "absolute",
	insetInlineEnd: t.space.$1,
	insetBlock: t.space.$1,
	borderRadius: `calc(${t.radii.$md} - ${t.space.$1})`,
	color: t.colors.$neutralAlpha400,
	paddingInline: t.space.$2,
	"&::before": {
		content: "\"\"",
		position: "absolute",
		inset: `calc(${t.space.$1} * -1)`,
		display: "block",
		borderRadius: t.radii.$md
	}
});
const centeredFlex = (display = "flex") => ({
	display,
	justifyContent: "center",
	alignItems: "center"
});
const unstyledScrollbar = (t) => {
	const baseStyles = {
		"::-webkit-scrollbar": {
			background: t.colors.$neutralAlpha50,
			width: "6px",
			height: "6px"
		},
		"::-webkit-scrollbar-thumb": {
			background: t.colors.$neutralAlpha600,
			borderRadius: t.radii.$sm,
			transition: `background-color ${t.transitionDuration.$fast} ${t.transitionTiming.$common}`
		},
		"::-webkit-scrollbar-thumb:hover": { background: t.colors.$neutralAlpha700 },
		"::-webkit-scrollbar-track": { background: t.colors.$neutralAlpha50 }
	};
	baseStyles["@supports not selector(::-webkit-scrollbar)"] = {
		scrollbarColor: `${t.colors.$neutralAlpha600} ${t.colors.$neutralAlpha50}`,
		scrollbarWidth: "thin"
	};
	return baseStyles;
};
const maxHeightScroller = (t) => ({
	height: "100%",
	overflowY: "auto",
	...unstyledScrollbar(t)
});
const mergedColorsBackground = (colorBack, colorFront) => {
	return `linear-gradient(${colorFront},${colorFront}), linear-gradient(${colorBack}, ${colorBack})`;
};
const mutedBackground = (t) => {
	return clerkCssVar("color-muted", t.colors.$colorMuted || mergedColorsBackground(colors.setAlpha(t.colors.$colorBackground, 1), t.colors.$neutralAlpha50));
};
const visuallyHidden = () => ({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: "1px",
	overflow: "hidden",
	position: "absolute",
	whiteSpace: "nowrap",
	width: "1px"
});
const common = {
	textVariants,
	borderVariants,
	focusRingStyles,
	focusRing,
	disabled,
	borderColor,
	inputTrailingButton,
	centeredFlex,
	maxHeightScroller,
	mutedBackground,
	unstyledScrollbar,
	mergedColorsBackground,
	visuallyHidden
};

//#endregion
export { common };
//# sourceMappingURL=common.js.map