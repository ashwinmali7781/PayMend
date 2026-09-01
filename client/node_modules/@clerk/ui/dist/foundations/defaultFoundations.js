import { borderStyles, borderWidths } from "./borders.js";
import { colors } from "./colors.js";
import { opacity } from "./opacity.js";
import { shadows } from "./shadows.js";
import { radii, sizes, space } from "./sizes.js";
import { transitionDuration, transitionDurationValues, transitionProperty, transitionTiming } from "./transitions.js";
import { fontSizes, fontStyles, fontWeights, fonts, letterSpacings, lineHeights } from "./typography.js";
import { zIndices } from "./zIndices.js";

//#region src/foundations/defaultFoundations.ts
const defaultInternalThemeFoundations = Object.freeze({
	colors,
	fonts,
	fontStyles,
	fontSizes,
	fontWeights,
	letterSpacings,
	lineHeights,
	radii,
	sizes,
	space,
	shadows,
	transitionProperty,
	transitionTiming,
	transitionDuration,
	transitionDurationValues,
	opacity,
	borderStyles,
	borderWidths,
	zIndices
});

//#endregion
export { defaultInternalThemeFoundations };
//# sourceMappingURL=defaultFoundations.js.map