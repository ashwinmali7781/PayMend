import { CLERK_CLASS_RE, HAS_RE, POSITIONAL_PSEUDO_RE } from "./cssPatterns.js";
import { detectStructuralClerkCss } from "./detectClerkStylesheetUsage.js";
import { logger } from "@clerk/shared/logger";

//#region src/utils/warnAboutCustomizationWithoutPinning.ts
const OTHER_SELECTOR_RE = /[.#\w[:]/;
const CLERK_CLASS_GLOBAL_RE = /\.cl-[A-Za-z0-9_-]+/g;
const COMBINATOR_RE = /[>+~\s]/;
function formatStructuralCssWarning(patterns) {
	return [
		`Clerk: Structural CSS detected that may break on updates.`,
		``,
		`Found:`,
		patterns.slice(0, 5).map((p) => `  - ${p}`).join("\n") + (patterns.length > 5 ? `\n  (+${patterns.length - 5} more)` : ""),
		``,
		`These selectors depend on the internal DOM structure of Clerk's components, which may change when Clerk deploys component updates.`,
		`To prevent breaking changes, install @clerk/ui and pass it to ClerkProvider:`,
		``,
		`  import { ui } from '@clerk/ui'`,
		`  <ClerkProvider ui={ui}>`,
		``,
		`Learn more: https://clerk.com/docs/reference/components/versioning`,
		`(code=structural_css_pin_clerk_ui)`
	].join("\n");
}
/**
* Checks if a CSS-in-JS selector has adjacency with another selector.
* For nested selectors like "& > .foo" or "& .cl-something", we check if
* there's a .cl- class combined with another selector via combinator/descendant.
*/
function hasAdjacencyWithOtherSelector(selector) {
	const rest = selector.replace(/^&\s*/, "");
	const hasClerkClass = CLERK_CLASS_RE.test(rest);
	const hasOtherSelector = OTHER_SELECTOR_RE.test(rest.replace(CLERK_CLASS_GLOBAL_RE, ""));
	return hasClerkClass || hasOtherSelector && COMBINATOR_RE.test(selector);
}
/**
* Checks if a CSS-in-JS selector key indicates structural DOM assumptions.
*/
function isStructuralSelector(selector) {
	if (!selector.startsWith("&")) return false;
	if (CLERK_CLASS_RE.test(selector)) return true;
	if (POSITIONAL_PSEUDO_RE.test(selector)) return true;
	if (HAS_RE.test(selector)) return true;
	if (hasAdjacencyWithOtherSelector(selector)) return true;
	return false;
}
/**
* Recursively collects structural selectors from a CSS-in-JS value.
*/
function collectStructuralSelectors(value) {
	if (!value || typeof value !== "object") return [];
	const selectors = [];
	for (const [key, nestedValue] of Object.entries(value)) {
		if (isStructuralSelector(key)) selectors.push(key);
		selectors.push(...collectStructuralSelectors(nestedValue));
	}
	return selectors;
}
/**
* Collects structural CSS patterns from appearance.elements.
* Returns patterns in format: elements.{key} "{selector}"
*/
function collectElementPatterns(elements) {
	const patterns = [];
	for (const [elementKey, value] of Object.entries(elements)) {
		if (typeof value === "string") continue;
		const selectors = collectStructuralSelectors(value);
		for (const selector of selectors) patterns.push(`elements.${elementKey} "${selector}"`);
	}
	return patterns;
}
/**
* Checks component-level appearance.elements for structural CSS patterns
* and warns if found (when version is not pinned).
*
* This is called when individual components mount with their own appearance,
* to catch structural CSS that wasn't passed through ClerkProvider.
*
* Note: The caller should check clerk.instanceType === 'development' before calling.
* This function assumes it's only called in development mode.
*
* @param appearance - The component-level appearance to check
* @param uiPinned - Whether the user has pinned their @clerk/ui version via options.ui
*/
function warnAboutComponentAppearance(appearance, uiPinned) {
	if (uiPinned) return;
	if (!appearance?.elements || Object.keys(appearance.elements).length === 0) return;
	const patterns = collectElementPatterns(appearance.elements);
	if (patterns.length > 0) logger.warnOnce(formatStructuralCssWarning(patterns));
}
/**
* Warns users when they are using customization
* (structural appearance.elements or structural CSS targeting .cl- classes)
* without pinning their @clerk/ui version.
*
* Note: The caller should check clerk.instanceType === 'development' before calling.
* This function assumes it's only called in development mode.
*
* If the user has explicitly imported @clerk/ui and passed it via the `ui` option,
* they have "pinned" their version and no warning is shown.
*
* Note: We check for `options.ui.__brand` (not just `options.ui`) because
* ui.ClerkUI is always set by SDKs for both CDN and bundled paths.
* The `__brand` marker is only present when the user explicitly imports @clerk/ui.
*/
function warnAboutCustomizationWithoutPinning(options) {
	if ((options?.ui)?.__brand) return;
	const patterns = [];
	const appearance = options?.appearance;
	if (appearance?.elements && Object.keys(appearance.elements).length > 0) patterns.push(...collectElementPatterns(appearance.elements));
	const structuralCssHits = detectStructuralClerkCss();
	for (const hit of structuralCssHits) patterns.push(`CSS "${hit.selector}"`);
	if (patterns.length > 0) logger.warnOnce(formatStructuralCssWarning(patterns));
}

//#endregion
export { warnAboutComponentAppearance, warnAboutCustomizationWithoutPinning };
//# sourceMappingURL=warnAboutCustomizationWithoutPinning.js.map