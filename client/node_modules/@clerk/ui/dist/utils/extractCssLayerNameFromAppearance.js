//#region src/utils/extractCssLayerNameFromAppearance.ts
/**
* Extracts cssLayerName from theme and moves it to appearance level.
*/
function extractCssLayerNameFromAppearance(appearance) {
	if (!appearance || typeof appearance !== "object") return appearance;
	const themeProperty = appearance.theme;
	if (!themeProperty) return appearance;
	let cssLayerNameFromTheme;
	if (Array.isArray(themeProperty)) {
		themeProperty.forEach((theme) => {
			if (!cssLayerNameFromTheme && typeof theme === "object" && theme.cssLayerName) cssLayerNameFromTheme = theme.cssLayerName;
		});
		const processedThemeArray = themeProperty.map((theme) => {
			if (typeof theme === "string") return theme;
			const { cssLayerName, ...rest } = theme;
			return rest;
		});
		const finalCssLayerName = appearance.cssLayerName || cssLayerNameFromTheme;
		const result = {
			...appearance,
			theme: processedThemeArray
		};
		if (finalCssLayerName) result.cssLayerName = finalCssLayerName;
		return result;
	} else {
		let cssLayerNameFromSingleTheme;
		if (typeof themeProperty === "object" && themeProperty.cssLayerName) cssLayerNameFromSingleTheme = themeProperty.cssLayerName;
		const processedTheme = typeof themeProperty === "string" ? themeProperty : (() => {
			const { cssLayerName, ...rest } = themeProperty;
			return rest;
		})();
		const finalCssLayerName = appearance.cssLayerName || cssLayerNameFromSingleTheme;
		const result = {
			...appearance,
			theme: processedTheme
		};
		if (finalCssLayerName) result.cssLayerName = finalCssLayerName;
		return result;
	}
}

//#endregion
export { extractCssLayerNameFromAppearance };
//# sourceMappingURL=extractCssLayerNameFromAppearance.js.map