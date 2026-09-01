import { applyTokensToString } from "./applyTokensToString.js";
import { Fragment, createElement } from "react";

//#region src/localization/applyMarkupToNodes.tsx
const TAGS = { bold: "strong" };
const TAG_RE = /<(\/?)(bold)>/g;
const stripMarkup = (s) => s.replace(/<\/?(bold)>/g, "");
const applyMarkupAndTokens = (template, tokens) => {
	if (!template) return "";
	const substitute = (s) => s.includes("{{") ? applyTokensToString(s, tokens) : s;
	if (!template.includes("<")) return substitute(template);
	const stack = [{
		tag: "root",
		children: []
	}];
	let cursor = 0;
	let match;
	TAG_RE.lastIndex = 0;
	while ((match = TAG_RE.exec(template)) !== null) {
		const [full, slash, tag] = match;
		const text = template.slice(cursor, match.index);
		if (text) stack[stack.length - 1].children.push(substitute(text));
		cursor = match.index + full.length;
		if (!slash) {
			stack.push({
				tag,
				children: []
			});
			continue;
		}
		const top = stack.pop();
		if (!top || top.tag !== tag) return substitute(template);
		stack[stack.length - 1].children.push(createElement(TAGS[top.tag], { key: match.index }, ...top.children));
	}
	if (stack.length !== 1) return substitute(template);
	const tail = template.slice(cursor);
	if (tail) stack[0].children.push(substitute(tail));
	const out = stack[0].children;
	if (out.length === 0) return "";
	if (out.length === 1) return out[0];
	return createElement(Fragment, null, ...out);
};

//#endregion
export { applyMarkupAndTokens, stripMarkup };
//# sourceMappingURL=applyMarkupToNodes.js.map