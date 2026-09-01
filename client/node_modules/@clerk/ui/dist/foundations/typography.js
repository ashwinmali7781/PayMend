import { clerkCssVar } from "../utils/cssVariables.js";

//#region src/foundations/typography.ts
const fontWeights = Object.freeze({
	normal: clerkCssVar("font-weight-normal", clerkCssVar("font-weight", "400")),
	medium: clerkCssVar("font-weight-medium", "500"),
	semibold: clerkCssVar("font-weight-semibold", "600"),
	bold: clerkCssVar("font-weight-bold", "700")
});
const lineHeights = Object.freeze({
	normal: "normal",
	extraSmall: "calc(16 / 12)",
	small: "calc(18 / 13)",
	medium: "calc(24 / 17)",
	large: "calc(16 / 11)"
});
const letterSpacings = Object.freeze({ normal: "normal" });
const FONT_SIZE_SCALE_RATIOS = Object.freeze({
	xs: "11 / 13",
	sm: "12 / 13",
	md: "1",
	lg: "17 / 13",
	xl: "24 / 13"
});
const fontSizesDefaultVar = clerkCssVar("font-size", "0.8125rem");
const fontSizes = Object.freeze({
	xs: clerkCssVar("font-size-xs", `calc(${fontSizesDefaultVar} * ${FONT_SIZE_SCALE_RATIOS.xs})`),
	sm: clerkCssVar("font-size-sm", `calc(${fontSizesDefaultVar} * ${FONT_SIZE_SCALE_RATIOS.sm})`),
	md: clerkCssVar("font-size-md", fontSizesDefaultVar),
	lg: clerkCssVar("font-size-lg", `calc(${fontSizesDefaultVar} * ${FONT_SIZE_SCALE_RATIOS.lg})`),
	xl: clerkCssVar("font-size-xl", `calc(${fontSizesDefaultVar} * ${FONT_SIZE_SCALE_RATIOS.xl})`)
});
const fontStyles = Object.freeze({ normal: "normal" });
const fonts = Object.freeze({
	main: clerkCssVar("font-family", "inherit"),
	buttons: clerkCssVar("font-family-buttons", clerkCssVar("font-family", "inherit")),
	mono: clerkCssVar("font-family-mono", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
});

//#endregion
export { FONT_SIZE_SCALE_RATIOS, fontSizes, fontStyles, fontWeights, fonts, letterSpacings, lineHeights };
//# sourceMappingURL=typography.js.map