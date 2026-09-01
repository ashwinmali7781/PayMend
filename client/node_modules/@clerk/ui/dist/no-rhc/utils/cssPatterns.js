//#region src/utils/cssPatterns.ts
/**
* Shared CSS selector patterns for detecting structural DOM assumptions.
* Used by both stylesheet detection and CSS-in-JS analysis.
*/
const CLERK_CLASS_RE = /\.cl-[A-Za-z0-9_-]+/;
const CLERK_INTERNAL_CLASS_RE = /\.cl-internal-[A-Za-z0-9_-]+/g;
const CLERK_ATTR_RE = /\[\s*class\s*(\^=|\*=|\$=)\s*["']?[^"'\]]*cl-[^"'\]]*["']?\s*\]/i;
const POSITIONAL_PSEUDO_RE = /:(nth-child|nth-of-type|first-child|last-child|only-child|empty)\b/i;
const HAS_RE = /:has\(/i;

//#endregion
export { CLERK_ATTR_RE, CLERK_CLASS_RE, CLERK_INTERNAL_CLASS_RE, HAS_RE, POSITIONAL_PSEUDO_RE };
//# sourceMappingURL=cssPatterns.js.map