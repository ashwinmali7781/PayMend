import { cssSupports } from "../cssSupports.js";
import { COLOR_BOUNDS, MODERN_CSS_LIMITS } from "./constants.js";
import { createAlphaColorMixString, createColorMixString, createRelativeColorString } from "./utils.js";

//#region src/utils/colors/modern.ts
/**
* CSS-based color manipulation utilities
* Uses color-mix() and relative color syntax when supported
*/
/**
* CSS-based color manipulation utilities
* Uses color-mix() and relative color syntax when supported
*/
const colors = {
	/**
	* Lightens a color by a percentage
	*/
	lighten: (color, percentage = 0) => {
		if (!color) return;
		if (cssSupports.relativeColorSyntax()) return createRelativeColorString(color, "h", "s", `calc(l + ${percentage * 100}%)`);
		if (cssSupports.colorMix()) return createColorMixString(color, "white", Math.min(percentage * 100, MODERN_CSS_LIMITS.MAX_LIGHTNESS_MIX));
		return color;
	},
	/**
	* Makes a color transparent by a percentage
	*/
	makeTransparent: (color, percentage = 0) => {
		if (!color || color.toString() === "") return;
		if (cssSupports.colorMix()) return createAlphaColorMixString(color, Math.max((1 - percentage) * 100, MODERN_CSS_LIMITS.MIN_ALPHA_PERCENTAGE));
		return color;
	},
	/**
	* Makes a color completely opaque
	*/
	makeSolid: (color) => {
		if (!color) return;
		if (cssSupports.relativeColorSyntax()) return createRelativeColorString(color, "h", "s", "l", "1");
		if (cssSupports.colorMix()) return `color-mix(in srgb, ${color}, ${color} 100%)`;
		return color;
	},
	/**
	* Sets the alpha value of a color
	*/
	setAlpha: (color, alpha) => {
		const clampedAlpha = Math.min(Math.max(alpha, COLOR_BOUNDS.alpha.min), COLOR_BOUNDS.alpha.max);
		if (cssSupports.relativeColorSyntax()) return createRelativeColorString(color, "h", "s", "l", clampedAlpha.toString());
		if (cssSupports.colorMix()) return createAlphaColorMixString(color, clampedAlpha * 100);
		return color;
	},
	/**
	* Adjusts color for better contrast/lightness
	*/
	adjustForLightness: (color, lightness = 5) => {
		if (!color) return;
		if (cssSupports.colorMix()) return createColorMixString(color, "white", Math.min(lightness * MODERN_CSS_LIMITS.MIX_MULTIPLIER, MODERN_CSS_LIMITS.MAX_LIGHTNESS_ADJUSTMENT));
		return color;
	}
};

//#endregion
export { colors };
//# sourceMappingURL=modern.js.map