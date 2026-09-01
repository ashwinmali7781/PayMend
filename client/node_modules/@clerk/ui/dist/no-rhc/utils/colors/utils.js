import { cssSupports } from "../cssSupports.js";
import { ALL_SHADES, ALPHA_PERCENTAGES, LIGHTNESS_CONFIG, LIGHTNESS_MIX_DATA, RELATIVE_SHADE_STEPS } from "./constants.js";

//#region src/utils/colors/utils.ts
/**
* Pre-computed empty color scale to avoid object creation
*/
const EMPTY_COLOR_SCALE = Object.freeze(ALL_SHADES.reduce((scale, shade) => {
	scale[shade] = void 0;
	return scale;
}, {}));
/**
* Fast empty color scale creation - returns pre-computed frozen object
*/
const createEmptyColorScale = () => {
	return { ...EMPTY_COLOR_SCALE };
};
/**
* Core color generation functions
*/
/**
* Create a color-mix string
* @param baseColor - The base color
* @param mixColor - The color to mix with
* @param percentage - The percentage of the mix
* @returns The color-mix string
*/
function createColorMixString(baseColor, mixColor, percentage) {
	return `color-mix(in srgb, ${baseColor}, ${mixColor} ${percentage}%)`;
}
/**
* Generate a relative color syntax string
* @param color - The base color
* @param hue - The hue component
* @param saturation - The saturation component
* @param lightness - The lightness component
* @param alpha - The alpha component (optional)
* @returns The relative color syntax string
*/
function createRelativeColorString(color, hue, saturation, lightness, alpha) {
	return `hsl(from ${color} ${hue} ${saturation} ${lightness}${alpha ? ` / ${alpha}` : ""})`;
}
/**
* Create an alpha color-mix string
* @param color - The base color
* @param alphaPercentage - The alpha percentage
* @returns The alpha color-mix string
*/
function createAlphaColorMixString(color, alphaPercentage) {
	return `color-mix(in srgb, transparent, ${color} ${alphaPercentage}%)`;
}
/**
* Generate a relative color syntax string
* @param color - The base color
* @param shade - The shade to generate the color for
* @returns The relative color syntax string
*/
function generateRelativeColorSyntax(color, shade) {
	if (shade === 500) return color;
	const steps = RELATIVE_SHADE_STEPS[shade];
	if (!steps) return color;
	const { TARGET_LIGHT, TARGET_DARK, LIGHT_STEPS, DARK_STEPS } = LIGHTNESS_CONFIG;
	if (shade < 500) return createRelativeColorString(color, "h", "s", `calc(l + (${steps} * ((${TARGET_LIGHT} - l) / ${LIGHT_STEPS})))`);
	return createRelativeColorString(color, "h", "s", `calc(l - (${steps} * ((l - ${TARGET_DARK}) / ${DARK_STEPS})))`);
}
/**
* Generate a color-mix string
* @param color - The base color
* @param shade - The shade to generate the color for
* @returns The color-mix string
*/
function generateColorMixSyntax(color, shade) {
	if (shade === 500) return color;
	const mixData = LIGHTNESS_MIX_DATA[shade];
	if (!mixData.mixColor) return color;
	return createColorMixString(color, mixData.mixColor, mixData.percentage);
}
function generateAlphaColorMix(color, shade) {
	const alphaPercentage = ALPHA_PERCENTAGES[shade];
	return createAlphaColorMixString(color, alphaPercentage);
}
/**
* Get the optimal color variant for the given shade
* @param color - The base color
* @param shade - The shade to generate the color for
* @returns The optimal color variant
*/
function getSupportedColorVariant(color, shade) {
	if (shade === 500) return color;
	if (cssSupports.relativeColorSyntax()) return generateRelativeColorSyntax(color, shade);
	if (cssSupports.colorMix()) return generateColorMixSyntax(color, shade);
	return color;
}

//#endregion
export { createAlphaColorMixString, createColorMixString, createEmptyColorScale, createRelativeColorString, generateAlphaColorMix, getSupportedColorVariant };
//# sourceMappingURL=utils.js.map