//#region src/utils/cssVariables.ts
/**
* Extracts the computed value of a CSS custom property (CSS variable)
* @param variableName - The CSS variable name in any of these formats:
*   - 'var(--color)'
*   - '--color'
*   - 'color' (will be prefixed with --)
* @param element - Optional element to get the variable from (defaults to document.documentElement)
* @returns The computed CSS variable value as a string, or null if not found
* @example
* const colorValue = extractCSSVariableValue('var(--color)'); // "red"
* const colorValue2 = extractCSSVariableValue('--color'); // "red"
* const colorValue3 = extractCSSVariableValue('color'); // "red"
* const colorValue4 = extractCSSVariableValue('--nonexistent'); // null
* const colorValue5 = extractCSSVariableValue('--nonexistent', document.body); // null
* const colorValue6 = extractCSSVariableValue('--nonexistent', document.body, '#000000'); // "#000000"
*/
function extractCSSVariableValue(variableName, element) {
	if (typeof window === "undefined" || typeof getComputedStyle === "undefined") return null;
	let cleanVariableName;
	if (variableName.startsWith("var(") && variableName.endsWith(")")) cleanVariableName = variableName.slice(4, -1).trim();
	else if (variableName.startsWith("--")) cleanVariableName = variableName;
	else cleanVariableName = `--${variableName}`;
	let targetElement;
	try {
		if (element) targetElement = element;
		else if (typeof document !== "undefined" && document.documentElement) targetElement = document.documentElement;
		else return null;
	} catch {
		return null;
	}
	try {
		return getComputedStyle(targetElement).getPropertyValue(cleanVariableName).trim() || null;
	} catch {
		return null;
	}
}
/**
* Checks if a given value represents a CSS variable (var() function)
* @param value - The value to check
* @returns True if the value is a CSS variable, false otherwise
* @example
* isCSSVariable('var(--color)'); // true
* isCSSVariable('var(--color, red)'); // true
* isCSSVariable('--color'); // false
* isCSSVariable('red'); // false
* isCSSVariable('#ff0000'); // false
*/
function isCSSVariable(value) {
	if (!value || typeof value !== "string") return false;
	const trimmed = value.trim();
	if (!trimmed.startsWith("var(") || !trimmed.endsWith(")")) return false;
	const content = trimmed.slice(4, -1).trim();
	if (!content.startsWith("--")) return false;
	const commaIndex = content.indexOf(",");
	const variableName = commaIndex === -1 ? content : content.slice(0, commaIndex).trim();
	return /^--[a-zA-Z0-9-_]+$/.test(variableName);
}
/**
* Resolves a CSS variable to its computed value, with fallback support
* Handles var() syntax and extracts variable name and fallback value
* @param value - The CSS variable string (e.g., 'var(--color, red)')
* @param element - Optional element to get the variable from
* @returns The resolved value or null if not found and no fallback provided
* @example
* resolveCSSVariable('var(--primary-color)'); // "blue" (if --primary-color is blue)
* resolveCSSVariable('var(--missing-color, red)'); // "red" (fallback)
* resolveCSSVariable('var(--missing-color)'); // null
* resolveCSSVariable('red'); // null (not a CSS variable)
*/
function resolveCSSVariable(value, element) {
	if (!isCSSVariable(value)) return null;
	const content = value.trim().slice(4, -1).trim();
	const commaIndex = content.indexOf(",");
	let variableName;
	let fallbackValue = null;
	if (commaIndex === -1) variableName = content;
	else {
		variableName = content.slice(0, commaIndex).trim();
		fallbackValue = content.slice(commaIndex + 1).trim();
	}
	const resolvedValue = extractCSSVariableValue(variableName, element);
	if (resolvedValue) return resolvedValue;
	if (fallbackValue) {
		if (isCSSVariable(fallbackValue)) return resolveCSSVariable(fallbackValue, element);
		return fallbackValue;
	}
	return null;
}
/**
* Resolves a CSS property to its computed value, in the context of a DOM element
* This is used to resolve CSS variables to their computed values, in the context of a DOM element.
*
* @param parentElement - The parent element to resolve the property in the context of
* @param propertyName - The CSS property name (e.g., 'color', 'font-weight', 'font-size')
* @param propertyValue - The property value to resolve (can be a CSS variable)
* @returns The resolved property value as a string
*/
function resolveComputedCSSProperty(parentElement, propertyName, propertyValue) {
	const element = document.createElement("div");
	element.style.setProperty(propertyName, propertyValue);
	parentElement.appendChild(element);
	const computedValue = window.getComputedStyle(element).getPropertyValue(propertyName);
	parentElement.removeChild(element);
	return computedValue.trim();
}
/**
* Resolves a color to its computed value, in the context of a DOM element
* This is used to resolve CSS variables to their computed values, in the context of a DOM element to support passing
* CSS variables to Stripe Elements.
*
* @param parentElement - The parent element to resolve the color in the context of
* @param color - The color to resolve
* @param backgroundColor - The background color to use for the canvas, this is used to ensure colors that
* contain an alpha value mix together correctly. So the output matches the alpha usage in the CSS.
* @returns The resolved color as a hex string
*/
function resolveComputedCSSColor(parentElement, color, backgroundColor = "white") {
	const computedColor = resolveComputedCSSProperty(parentElement, "color", color);
	const computedBackgroundColor = resolveComputedCSSProperty(parentElement, "color", backgroundColor);
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	const ctx = canvas.getContext("2d");
	if (!ctx) return computedColor;
	ctx.fillStyle = computedBackgroundColor;
	ctx.fillRect(0, 0, 1, 1);
	ctx.fillStyle = computedColor;
	ctx.fillRect(0, 0, 1, 1);
	const { data } = ctx.getImageData(0, 0, 1, 1);
	return `#${data[0].toString(16).padStart(2, "0")}${data[1].toString(16).padStart(2, "0")}${data[2].toString(16).padStart(2, "0")}`;
}
/**
* Creates a CSS variable prefixed with `clerk-` with a default value
* @param name - The name of the CSS variable
* @param defaultValue - The default value
* @returns The CSS variable string
*/
const clerkCssVar = (name, defaultValue) => `var(--clerk-${name}, ${defaultValue})`;

//#endregion
export { clerkCssVar, resolveCSSVariable, resolveComputedCSSColor, resolveComputedCSSProperty };
//# sourceMappingURL=cssVariables.js.map