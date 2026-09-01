import { baseTheme, getBaseTheme } from "../baseTheme.js";
import { createInternalTheme } from "../foundations/createInternalTheme.js";
import { defaultInternalTheme } from "../foundations/index.js";
import { createColorScales, createFontSizeScale, createFontWeightScale, createFonts, createRadiiUnits, createShadowsUnits, createSpaceScale } from "./parseVariables.js";
import { fastDeepMergeAndReplace } from "@clerk/shared/utils";

//#region src/customizables/parseAppearance.ts
const defaultOptions = {
	logoPlacement: "inside",
	socialButtonsPlacement: "top",
	socialButtonsVariant: "auto",
	logoImageUrl: "",
	logoLinkUrl: "",
	showOptionalFields: false,
	helpPageUrl: "",
	privacyPageUrl: "",
	termsPageUrl: "",
	shimmer: true,
	animations: true,
	unsafe_disableDevelopmentModeWarnings: false,
	autoFocus: true,
	elevation: "raised"
};
const defaultCaptchaOptions = {
	theme: "auto",
	size: "normal",
	language: ""
};
/**
* Parses the public appearance object.
* It splits the resulting styles into 2 objects: parsedElements, parsedInternalTheme
* parsedElements is used by the makeCustomizables HOC to handle per-element styling
* parsedInternalTheme is used by FlowCard/InternalThemeProvider for generic theming
* Both are injected by the AppearanceContext
*/
const parseAppearance = (cascade) => {
	const { globalAppearance, appearance: componentAppearance, appearanceKey } = cascade;
	const appearanceList = [];
	[
		globalAppearance,
		globalAppearance?.[appearanceKey],
		componentAppearance
	].forEach((a) => expand(a, appearanceList));
	const parsedInternalTheme = parseVariables(appearanceList);
	const parsedOptions = parseOptions(appearanceList);
	const parsedCaptcha = parseCaptcha(appearanceList);
	if (!appearanceList.find((a) => {
		return !!a.simpleStyles;
	})) appearanceList.unshift(baseTheme);
	return {
		parsedElements: parseElements(appearanceList.map((appearance) => {
			if (!appearance.elements || typeof appearance.elements !== "function") return appearance;
			const res = { ...appearance };
			res.elements = appearance.elements({ theme: parsedInternalTheme });
			return res;
		})),
		parsedInternalTheme,
		parsedOptions,
		parsedCaptcha
	};
};
const expand = (theme, cascade) => {
	if (!theme) return;
	const themeProperty = theme.theme;
	if (themeProperty !== void 0) (Array.isArray(themeProperty) ? themeProperty : [themeProperty]).forEach((t) => {
		if (typeof t === "string") expand(getBaseTheme(t), cascade);
		else expand(t, cascade);
	});
	cascade.push(theme);
};
const parseElements = (appearances) => {
	return appearances.map((appearance) => ({ ...appearance?.elements }));
};
const parseOptions = (appearanceList) => {
	return {
		...defaultOptions,
		...appearanceList.reduce((acc, appearance) => ({
			...acc,
			...appearance.options
		}), {})
	};
};
const parseCaptcha = (appearanceList) => {
	return {
		...defaultCaptchaOptions,
		...appearanceList.reduce((acc, appearance) => {
			if (appearance.captcha) {
				const { theme: captchaTheme, size, language } = appearance.captcha;
				return {
					...acc,
					...captchaTheme && { theme: captchaTheme },
					...size && { size },
					...language && { language }
				};
			}
			return acc;
		}, {})
	};
};
const parseVariables = (appearances) => {
	const res = {};
	fastDeepMergeAndReplace({ ...defaultInternalTheme }, res);
	appearances.forEach((appearance) => {
		fastDeepMergeAndReplace(createInternalThemeFromVariables(appearance), res);
	});
	return res;
};
const createInternalThemeFromVariables = (theme) => {
	if (!theme) return {};
	return createInternalTheme({
		colors: { ...createColorScales(theme) },
		radii: { ...createRadiiUnits(theme) },
		space: { ...createSpaceScale(theme) },
		fontSizes: { ...createFontSizeScale(theme) },
		fontWeights: { ...createFontWeightScale(theme) },
		fonts: { ...createFonts(theme) },
		shadows: { ...createShadowsUnits(theme) }
	});
};

//#endregion
export { parseAppearance };
//# sourceMappingURL=parseAppearance.js.map