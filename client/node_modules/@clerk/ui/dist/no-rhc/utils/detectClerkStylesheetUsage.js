import { CLERK_ATTR_RE, CLERK_CLASS_RE, CLERK_INTERNAL_CLASS_RE, HAS_RE, POSITIONAL_PSEUDO_RE } from "./cssPatterns.js";

//#region src/utils/detectClerkStylesheetUsage.ts
/**
* Strips .cl-internal-* classes from a selector so they don't trigger detection.
* These are Clerk's own generated classes, not user-facing customization points.
*/
function stripInternalClasses(selector) {
	return selector.replace(CLERK_INTERNAL_CLASS_RE, "");
}
function isProbablyClerkSelector(selector) {
	const stripped = stripInternalClasses(selector);
	return CLERK_CLASS_RE.test(stripped) || CLERK_ATTR_RE.test(stripped);
}
function splitSelectorList(selectorText) {
	return selectorText.split(",").map((s) => s.trim()).filter(Boolean);
}
/**
* Checks if a selector has a .cl- class combined with another selector
* (class, tag, attribute, or pseudo) via descendant or combinator relationship.
* Examples that match: ".cl-root .foo", ".foo .cl-root", ".cl-root > div", "div > .cl-button"
*/
function hasClerkWithAdjacency(selector) {
	return /\.cl-[A-Za-z0-9_-]+[\s>+~]+[.#\w[:]/.test(selector) || /[.#\w\]:][\s>+~]+\.cl-[A-Za-z0-9_-]+/.test(selector);
}
function analyzeSelector(selector) {
	const reason = [];
	if (hasClerkWithAdjacency(selector)) {
		if (/[>+~]/.test(selector)) reason.push("combinator(>+~)");
		if (/\s+/.test(selector)) reason.push("descendant(combinator)");
	}
	if (POSITIONAL_PSEUDO_RE.test(selector)) reason.push("positional-pseudo");
	if (HAS_RE.test(selector)) reason.push(":has()");
	if ((selector.match(/\.cl-[A-Za-z0-9_-]+/g) || []).length >= 2) reason.push("multiple-clerk-classes");
	if (/(^|[\s>+~(])([a-z]+)\.cl-[A-Za-z0-9_-]+/i.test(selector)) reason.push("tag+cl-class");
	return {
		structural: reason.includes("combinator(>+~)") || reason.includes("descendant(combinator)") || reason.includes("positional-pseudo") || reason.includes(":has()") || reason.includes("multiple-clerk-classes") || reason.includes("tag+cl-class"),
		reason
	};
}
function safeGetCssRules(sheet) {
	try {
		return sheet.cssRules;
	} catch {
		return null;
	}
}
const CSS_STYLE_RULE = 1;
function walkRules(rules, sheet, out) {
	for (const rule of Array.from(rules)) {
		if (rule.type === CSS_STYLE_RULE && "selectorText" in rule) {
			const styleRule = rule;
			const selectorText = styleRule.selectorText || "";
			for (const selector of splitSelectorList(selectorText)) {
				if (!isProbablyClerkSelector(selector)) continue;
				const { structural, reason } = analyzeSelector(selector);
				if (!structural) continue;
				out.push({
					stylesheetHref: sheet.href ?? null,
					selector,
					cssText: styleRule.cssText,
					reason
				});
			}
			continue;
		}
		if ("cssRules" in rule && rule.cssRules) walkRules(rule.cssRules, sheet, out);
	}
}
/**
* Detects CSS rules that target Clerk's .cl- classes in a structural way
* (using combinators, positional pseudo-selectors, :has(), etc.)
*
* Simple class targeting like `.cl-button { color: red; }` is NOT flagged.
* Structural targeting like `.cl-card > .cl-button` or `div.cl-button` IS flagged.
*/
function detectStructuralClerkCss() {
	if (typeof document === "undefined") return [];
	const hits = [];
	for (const sheet of Array.from(document.styleSheets)) {
		const rules = safeGetCssRules(sheet);
		if (!rules) continue;
		walkRules(rules, sheet, hits);
	}
	return hits;
}

//#endregion
export { detectStructuralClerkCss };
//# sourceMappingURL=detectClerkStylesheetUsage.js.map