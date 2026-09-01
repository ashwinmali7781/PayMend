//#region src/utils/cssSupports.ts
const CSS_FEATURE_TESTS = {
	relativeColorSyntax: "color: hsl(from white h s l)",
	colorMix: "color: color-mix(in srgb, white, black)",
	lightDark: "color: light-dark(white, black)"
};
let SUPPORTS_RELATIVE_COLOR;
let SUPPORTS_COLOR_MIX;
let SUPPORTS_MODERN_COLOR;
let SUPPORTS_LIGHT_DARK;
const cssSupports = {
	relativeColorSyntax: () => {
		if (SUPPORTS_RELATIVE_COLOR !== void 0) return SUPPORTS_RELATIVE_COLOR;
		try {
			SUPPORTS_RELATIVE_COLOR = CSS.supports(CSS_FEATURE_TESTS.relativeColorSyntax);
		} catch {
			SUPPORTS_RELATIVE_COLOR = false;
		}
		return SUPPORTS_RELATIVE_COLOR;
	},
	colorMix: () => {
		if (SUPPORTS_COLOR_MIX !== void 0) return SUPPORTS_COLOR_MIX;
		try {
			SUPPORTS_COLOR_MIX = CSS.supports(CSS_FEATURE_TESTS.colorMix);
		} catch {
			SUPPORTS_COLOR_MIX = false;
		}
		return SUPPORTS_COLOR_MIX;
	},
	/**
	* Returns true if either relativeColorSyntax or colorMix is supported
	*/
	modernColor() {
		if (SUPPORTS_MODERN_COLOR !== void 0) return SUPPORTS_MODERN_COLOR;
		try {
			SUPPORTS_MODERN_COLOR = this.relativeColorSyntax() || this.colorMix();
		} catch {
			SUPPORTS_MODERN_COLOR = false;
		}
		return SUPPORTS_MODERN_COLOR;
	},
	/**
	* Returns true if the light-dark() CSS function is supported
	*/
	lightDark: () => {
		if (SUPPORTS_LIGHT_DARK !== void 0) return SUPPORTS_LIGHT_DARK;
		try {
			SUPPORTS_LIGHT_DARK = CSS.supports(CSS_FEATURE_TESTS.lightDark);
		} catch {
			SUPPORTS_LIGHT_DARK = false;
		}
		return SUPPORTS_LIGHT_DARK;
	}
};

//#endregion
export { cssSupports };
//# sourceMappingURL=cssSupports.js.map