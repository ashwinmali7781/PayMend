import { cssSupports } from "./cssSupports.js";

//#region src/utils/lightDark.ts
/**
* Returns a light-dark() CSS function string when supported,
* otherwise returns the light value as a fallback.
*
* This ensures compatibility with the legacy color system which
* cannot parse light-dark() syntax.
*
* @param light - The color value for light mode
* @param dark - The color value for dark mode
* @returns CSS light-dark() function or the light value
*/
function lightDark(light, dark) {
	if (cssSupports.lightDark() && cssSupports.modernColor()) return `light-dark(${light}, ${dark})`;
	return light;
}

//#endregion
export { lightDark };
//# sourceMappingURL=lightDark.js.map