import { clerkCssVar } from "../utils/cssVariables.js";
import { colors as colors$1 } from "../utils/colors/index.js";
import { colorOptionToThemedAlphaScale, colorOptionToThemedLightnessScale } from "../utils/colors/scales.js";
import { lightDark } from "../utils/lightDark.js";

//#region src/foundations/colors.ts
const whiteAlpha = Object.freeze({
	whiteAlpha25: "hsla(0, 0%, 100%, 0.02)",
	whiteAlpha50: "hsla(0, 0%, 100%, 0.03)",
	whiteAlpha100: "hsla(0, 0%, 100%, 0.07)",
	whiteAlpha150: "hsla(0, 0%, 100%, 0.11)",
	whiteAlpha200: "hsla(0, 0%, 100%, 0.15)",
	whiteAlpha300: "hsla(0, 0%, 100%, 0.28)",
	whiteAlpha400: "hsla(0, 0%, 100%, 0.41)",
	whiteAlpha500: "hsla(0, 0%, 100%, 0.53)",
	whiteAlpha600: "hsla(0, 0%, 100%, 0.62)",
	whiteAlpha700: "hsla(0, 0%, 100%, 0.73)",
	whiteAlpha750: "hsla(0, 0%, 100%, 0.78)",
	whiteAlpha800: "hsla(0, 0%, 100%, 0.81)",
	whiteAlpha850: "hsla(0, 0%, 100%, 0.84)",
	whiteAlpha900: "hsla(0, 0%, 100%, 0.87)",
	whiteAlpha950: "hsla(0, 0%, 100%, 0.92)"
});
/**
* Color scale generation with clerkCssVar
*
* These functions will never return undefined because:
* 1. clerkCssVar always provides a fallback value (e.g., 'var(--clerk-color-danger, #EF4444)')
* 2. The fallback ensures a valid color string is always passed to the scale generation functions
* 3. Valid color strings always produce complete color scales
*
* Therefore, it's safe to assert these as NonNullable.
*/
const defaultColorNeutral = clerkCssVar("color-neutral", lightDark("#000000", "#ffffff"));
const dangerScale = colorOptionToThemedLightnessScale(clerkCssVar("color-danger", "#EF4444"), "danger");
const primaryScale = colorOptionToThemedLightnessScale(clerkCssVar("color-primary", lightDark("#2F3037", "#ffffff")), "primary");
const successScale = colorOptionToThemedLightnessScale(clerkCssVar("color-success", "#22C543"), "success");
const warningScale = colorOptionToThemedLightnessScale(clerkCssVar("color-warning", "#F36B16"), "warning");
const dangerAlphaScale = colorOptionToThemedAlphaScale(clerkCssVar("color-danger", "#EF4444"), "dangerAlpha");
const neutralAlphaScale = colorOptionToThemedAlphaScale(defaultColorNeutral, "neutralAlpha");
const primaryAlphaScale = colorOptionToThemedAlphaScale(clerkCssVar("color-primary", lightDark("#2F3037", "#ffffff")), "primaryAlpha");
const successAlphaScale = colorOptionToThemedAlphaScale(clerkCssVar("color-success", "#22C543"), "successAlpha");
const warningAlphaScale = colorOptionToThemedAlphaScale(clerkCssVar("color-warning", "#F36B16"), "warningAlpha");
const borderAlphaScale = colorOptionToThemedAlphaScale(clerkCssVar("color-border", defaultColorNeutral), "borderAlpha");
const colorForeground = clerkCssVar("color-foreground", lightDark("#212126", "white"));
const colorMutedForeground = clerkCssVar("color-muted-foreground", colors$1.makeTransparent(colorForeground, .35) || "#747686");
const colors = Object.freeze({
	avatarBorder: neutralAlphaScale.neutralAlpha200,
	avatarBackground: neutralAlphaScale.neutralAlpha400,
	colorModalBackdrop: clerkCssVar("color-modal-backdrop", colors$1.makeTransparent("#000000", .27) || neutralAlphaScale.neutralAlpha700),
	colorBackground: clerkCssVar("color-background", lightDark("#ffffff", "#212126")),
	colorInput: clerkCssVar("color-input", lightDark("white", "#26262B")),
	colorForeground,
	colorMutedForeground,
	colorMuted: void 0,
	colorRing: clerkCssVar("color-ring", colors$1.makeTransparent(defaultColorNeutral, .85) || neutralAlphaScale.neutralAlpha200),
	colorInputForeground: clerkCssVar("color-input-foreground", lightDark("#131316", "white")),
	colorPrimaryForeground: clerkCssVar("color-primary-foreground", lightDark("white", "black")),
	colorShimmer: clerkCssVar("color-shimmer", "rgba(255, 255, 255, 0.36)"),
	transparent: "transparent",
	white: "white",
	black: "black",
	...neutralAlphaScale,
	...whiteAlpha,
	...primaryScale,
	primaryHover: colors$1.adjustForLightness(primaryScale.primary500),
	...primaryAlphaScale,
	...dangerScale,
	...dangerAlphaScale,
	...warningScale,
	...warningAlphaScale,
	...successScale,
	...successAlphaScale,
	...borderAlphaScale
});

//#endregion
export { colors, neutralAlphaScale, whiteAlpha };
//# sourceMappingURL=colors.js.map