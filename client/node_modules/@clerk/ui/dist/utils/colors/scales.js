import { cssSupports } from "../cssSupports.js";
import { colors } from "./legacy.js";
import { ALL_SHADES, ALPHA_VALUES, COLOR_SCALE, DARK_SHADES, LIGHTNESS_CONFIG, LIGHT_SHADES } from "./constants.js";
import { createEmptyColorScale, generateAlphaColorMix, getSupportedColorVariant } from "./utils.js";

//#region src/utils/colors/scales.ts
/**
* Apply a prefix to a color scale
* @param scale - The color scale to apply the prefix to
* @param prefix - The prefix to apply
* @returns The color scale with the prefix applied
*/
function applyScalePrefix(scale, prefix) {
	const result = {};
	for (const [shade, color] of Object.entries(scale)) if (color !== void 0) result[prefix + shade] = color;
	return result;
}
/**
* Modern CSS alpha scale generation
*/
function generateModernAlphaScale(baseColor) {
	const scale = createEmptyColorScale();
	COLOR_SCALE.forEach((shade) => {
		scale[shade] = generateAlphaColorMix(baseColor, shade);
	});
	return scale;
}
/**
* Legacy HSLA alpha scale generation
*/
function generateLegacyAlphaScale(baseColor) {
	const scale = createEmptyColorScale();
	const parsedColor = colors.toHslaColor(baseColor);
	const baseWithoutAlpha = colors.setHslaAlpha(parsedColor, 0);
	COLOR_SCALE.forEach((shade, index) => {
		const alpha = ALPHA_VALUES[index] ?? 1;
		const alphaColor = colors.setHslaAlpha(baseWithoutAlpha, alpha);
		scale[shade] = colors.toHslaString(alphaColor);
	});
	return scale;
}
/**
* Modern CSS lightness scale generation
*/
function generateModernLightnessScale(baseColor) {
	const scale = createEmptyColorScale();
	COLOR_SCALE.forEach((shade) => {
		scale[shade] = getSupportedColorVariant(baseColor, shade);
	});
	return scale;
}
/**
* Legacy HSLA lightness scale generation
*/
function generateLegacyLightnessScale(baseColor) {
	const scale = createEmptyColorScale();
	const parsedColor = colors.toHslaColor(baseColor);
	scale["500"] = colors.toHslaString(parsedColor);
	const lightStep = (LIGHTNESS_CONFIG.TARGET_LIGHT - parsedColor.l) / LIGHT_SHADES.length;
	const darkStep = (parsedColor.l - LIGHTNESS_CONFIG.TARGET_DARK) / DARK_SHADES.length;
	LIGHT_SHADES.forEach((shade, index) => {
		const lightnessIncrease = (index + 1) * lightStep;
		const lightColor = colors.changeHslaLightness(parsedColor, lightnessIncrease);
		scale[shade] = colors.toHslaString(lightColor);
	});
	DARK_SHADES.forEach((shade, index) => {
		const lightnessDecrease = (index + 1) * darkStep * -1;
		const darkColor = colors.changeHslaLightness(parsedColor, lightnessDecrease);
		scale[shade] = colors.toHslaString(darkColor);
	});
	return scale;
}
/**
* Processes color input and validates it
*/
function processColorInput(color) {
	if (!color) return null;
	if (typeof color === "string") return { baseColor: color };
	if (color["500"]) return {
		baseColor: color["500"],
		userScale: color
	};
	if (typeof color === "object") {
		const hasValidShadeKeys = ALL_SHADES.some((shade) => color[shade]);
		if (hasValidShadeKeys && !color["500"]) throw new Error("You need to provide at least the 500 shade");
		if (!hasValidShadeKeys) return null;
	}
	return null;
}
/**
* Merges user-defined colors with generated scale
*/
function mergeWithUserScale(generated, userScale) {
	if (!userScale) return generated;
	return {
		...generated,
		...userScale
	};
}
/**
* Unified alpha scale generator that automatically chooses between modern and legacy implementations
* @param color - Base color string or existing color scale
* @returns Complete color scale with alpha variations
*/
function generateAlphaScale(color) {
	const processed = processColorInput(color);
	if (!processed) return createEmptyColorScale();
	const { baseColor, userScale } = processed;
	return mergeWithUserScale(cssSupports.modernColor() ? generateModernAlphaScale(baseColor) : generateLegacyAlphaScale(baseColor), userScale);
}
/**
* Unified lightness scale generator that automatically chooses between modern and legacy implementations
* @param color - Base color string or existing color scale
* @returns Complete color scale with lightness variations
*/
function generateLightnessScale(color) {
	const processed = processColorInput(color);
	if (!processed) return createEmptyColorScale();
	const { baseColor, userScale } = processed;
	return mergeWithUserScale(cssSupports.modernColor() ? generateModernLightnessScale(baseColor) : generateLegacyLightnessScale(baseColor), userScale);
}
/**
* Converts a color scale to CSS color strings
* Works with both modern CSS (color-mix, relative colors) and legacy HSLA
*/
function convertScaleToCssStrings(scale) {
	const result = {};
	for (const [shade, color] of Object.entries(scale)) if (color && color !== void 0) result[shade] = color;
	return result;
}
/**
* Applies prefix to a color scale and converts to CSS color strings
*/
function prefixAndConvertScale(scale, prefix) {
	return applyScalePrefix(convertScaleToCssStrings(scale), prefix);
}
/**
* Converts a color option to a themed alpha scale with prefix
* Returns CSS color values (modern color-mix/relative colors or legacy HSLA)
* @param colorOption - Color input (string or alpha scale object)
* @param prefix - Prefix to apply to scale keys
* @returns Prefixed CSS color scale or undefined
*/
const colorOptionToThemedAlphaScale = (colorOption, prefix) => {
	if (!colorOption) return;
	return prefixAndConvertScale(generateAlphaScale(colorOption), prefix);
};
/**
* Converts a color option to a themed lightness scale with prefix
* Returns CSS color values (modern color-mix/relative colors or legacy HSLA)
* @param colorOption - Color input (string or lightness scale object)
* @param prefix - Prefix to apply to scale keys
* @returns Prefixed CSS color scale or undefined
*/
const colorOptionToThemedLightnessScale = (colorOption, prefix) => {
	if (!colorOption) return;
	return prefixAndConvertScale(generateLightnessScale(colorOption), prefix);
};

//#endregion
export { colorOptionToThemedAlphaScale, colorOptionToThemedLightnessScale };
//# sourceMappingURL=scales.js.map