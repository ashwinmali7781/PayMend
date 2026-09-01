import { Text } from "../../customizables/index.js";
import { Tooltip } from "../../elements/Tooltip.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OAuthConsent/InlineAction.tsx
function InlineAction({ text, actionText, onClick, tooltipText }) {
	const idx = text.indexOf(actionText);
	if (idx === -1) return /* @__PURE__ */ jsx(Fragment$1, { children: text });
	let before = text.slice(0, idx);
	let after = text.slice(idx + actionText.length);
	let prefix = "";
	let suffix = "";
	if (before.endsWith("(")) {
		before = before.slice(0, -1);
		prefix = "(";
	}
	if (after.startsWith(")")) {
		after = after.slice(1);
		suffix = ")";
	}
	const actionContent = /* @__PURE__ */ jsxs(Tooltip.Root, { children: [/* @__PURE__ */ jsx(Tooltip.Trigger, { children: /* @__PURE__ */ jsx(Text, {
		as: "span",
		role: "button",
		tabIndex: 0,
		"aria-label": tooltipText,
		variant: "caption",
		onClick,
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onClick();
			}
		},
		sx: (t) => ({
			textDecoration: "underline",
			textDecorationStyle: "dotted",
			cursor: "pointer",
			outline: "none",
			display: "inline-block",
			"&:focus-visible": {
				outline: "2px solid",
				outlineColor: t.colors.$colorRing
			}
		}),
		children: actionText
	}) }), /* @__PURE__ */ jsx(Tooltip.Content, { text: tooltipText })] });
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		before,
		prefix || suffix ? /* @__PURE__ */ jsxs(Text, {
			as: "span",
			sx: { whiteSpace: "nowrap" },
			children: [
				prefix,
				actionContent,
				suffix
			]
		}) : actionContent,
		after
	] });
}

//#endregion
export { InlineAction };
//# sourceMappingURL=InlineAction.js.map