import { fromEntries } from "../utils/fromEntries.js";
import { cssSupports } from "../utils/cssSupports.js";
import { createAlphaColorMixString } from "../utils/colors/utils.js";
import { colors } from "../utils/colors/index.js";
import { colorOptionToThemedAlphaScale, colorOptionToThemedLightnessScale } from "../utils/colors/scales.js";
import { createShadowSet, generateShadow } from "../foundations/shadows.js";
import { BORDER_RADIUS_SCALE_RATIOS, spaceScaleKeys } from "../foundations/sizes.js";
import { FONT_SIZE_SCALE_RATIOS } from "../foundations/typography.js";
import { removeUndefinedProps } from "../utils/removeUndefinedProps.js";

//#region src/customizables/parseVariables.ts
const createMutedForegroundColor = (variables) => {
	if (variables.colorMutedForeground) return colors.toHslaString(variables.colorMutedForeground);
	return colors.makeTransparent(variables.colorForeground, .35);
};
const createColorScales = (theme) => {
	const variables = removeInvalidValues(theme.variables || {});
	const dangerScale = colorOptionToThemedLightnessScale(variables.colorDanger, "danger");
	const primaryScale = colorOptionToThemedLightnessScale(variables.colorPrimary, "primary");
	const successScale = colorOptionToThemedLightnessScale(variables.colorSuccess, "success");
	const warningScale = colorOptionToThemedLightnessScale(variables.colorWarning, "warning");
	const dangerAlphaScale = colorOptionToThemedAlphaScale(dangerScale?.danger500, "dangerAlpha");
	const neutralAlphaScale = colorOptionToThemedAlphaScale(variables.colorNeutral, "neutralAlpha");
	const primaryAlphaScale = colorOptionToThemedAlphaScale(primaryScale?.primary500, "primaryAlpha");
	const successAlphaScale = colorOptionToThemedAlphaScale(successScale?.success500, "successAlpha");
	const warningAlphaScale = colorOptionToThemedAlphaScale(warningScale?.warning500, "warningAlpha");
	const borderAlphaScale = colorOptionToThemedAlphaScale(variables.colorBorder || variables.colorNeutral, "borderAlpha");
	return removeUndefinedProps({
		...dangerScale,
		...primaryScale,
		...successScale,
		...warningScale,
		...dangerAlphaScale,
		...neutralAlphaScale,
		...primaryAlphaScale,
		...successAlphaScale,
		...warningAlphaScale,
		...borderAlphaScale,
		primaryHover: colors.adjustForLightness(primaryScale?.primary500),
		colorPrimaryForeground: variables.colorPrimaryForeground ? colors.toHslaString(variables.colorPrimaryForeground) : void 0,
		colorForeground: colors.toHslaString(variables.colorForeground),
		colorMutedForeground: createMutedForegroundColor(variables),
		colorInputForeground: colors.toHslaString(variables.colorInputForeground),
		colorBackground: colors.toHslaString(variables.colorBackground),
		colorInput: colors.toHslaString(variables.colorInput),
		colorShimmer: colors.toHslaString(variables.colorShimmer),
		colorMuted: variables.colorMuted ? colors.toHslaString(variables.colorMuted) : void 0,
		colorRing: variables.colorRing ? colors.toHslaString(variables.colorRing) : void 0,
		colorShadow: variables.colorShadow ? colors.toHslaString(variables.colorShadow) : void 0,
		colorModalBackdrop: variables.colorModalBackdrop ? colors.toHslaString(variables.colorModalBackdrop) : void 0,
		avatarBackground: neutralAlphaScale?.neutralAlpha400 ? colors.toHslaString(neutralAlphaScale.neutralAlpha400) : void 0,
		avatarBorder: neutralAlphaScale?.neutralAlpha200 ? colors.toHslaString(neutralAlphaScale.neutralAlpha200) : void 0
	});
};
const removeInvalidValues = (variables) => {
	if (cssSupports.modernColor()) return variables;
	return Object.fromEntries(Object.entries(variables).filter(([key, value]) => {
		if (typeof value === "string") {
			const isValid = !value.startsWith("var(");
			if (!isValid) console.warn(`Invalid color value: ${value} for key: ${key}, using default value instead. Using CSS variables is not supported in this browser.`);
			return isValid;
		}
		if (typeof value === "object") return Object.entries(value).every(([key, value]) => {
			if (typeof value !== "string") return true;
			const isValid = !value.startsWith("var(");
			if (!isValid) console.warn(`Invalid color value: ${value} for key: ${key}, using default value instead. Using CSS variables is not supported in this browser.`);
			return isValid;
		});
		return false;
	}));
};
const createRadiiUnits = (theme) => {
	const { borderRadius } = theme.variables || {};
	if (borderRadius === void 0) return;
	const md = borderRadius === "none" ? "0" : borderRadius;
	return {
		sm: `calc(${md} * ${BORDER_RADIUS_SCALE_RATIOS.sm})`,
		md,
		lg: `calc(${md} * ${BORDER_RADIUS_SCALE_RATIOS.lg})`,
		xl: `calc(${md} * ${BORDER_RADIUS_SCALE_RATIOS.xl})`
	};
};
const createSpaceScale = (theme) => {
	const { spacing } = theme.variables || {};
	if (spacing === void 0) return;
	return fromEntries(spaceScaleKeys.map((k) => {
		return [k, `calc(${spacing} * ${Number.parseFloat(k.replace("x", ".")) / .5 * .125})`];
	}));
};
const createFontSizeScale = (theme) => {
	const { fontSize } = theme.variables || {};
	if (fontSize === void 0) return;
	if (typeof fontSize === "object") return removeUndefinedProps(Object.fromEntries(Object.entries(FONT_SIZE_SCALE_RATIOS).map(([key, _ratio]) => [key, fontSize[key] ?? void 0])));
	return Object.fromEntries(Object.entries(FONT_SIZE_SCALE_RATIOS).map(([key, fraction]) => [key, fraction === "1" ? fontSize : `calc(${fontSize} * ${fraction})`]));
};
const createFontWeightScale = (theme) => {
	const { fontWeight } = theme.variables || {};
	return removeUndefinedProps({ ...fontWeight });
};
const createFonts = (theme) => {
	const { fontFamily, fontFamilyButtons, fontFamilyMono } = theme.variables || {};
	return removeUndefinedProps({
		main: fontFamily,
		buttons: fontFamilyButtons,
		mono: fontFamilyMono
	});
};
const createShadowsUnits = (theme) => {
	const { colorShadow } = theme.variables || {};
	if (!colorShadow) return;
	const shadowColor = colors.toHslaString(colorShadow);
	if (!shadowColor) return;
	return createShadowSet(shadowColor, generateShadow((color, alpha) => createAlphaColorMixString(color, alpha * 100)));
};

//#endregion
export { createColorScales, createFontSizeScale, createFontWeightScale, createFonts, createRadiiUnits, createShadowsUnits, createSpaceScale };
//# sourceMappingURL=parseVariables.js.map