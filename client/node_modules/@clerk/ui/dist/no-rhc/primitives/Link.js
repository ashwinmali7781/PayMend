import { createVariants } from "../styledSystem/createVariants.js";
import { common } from "../styledSystem/common.js";
import { applyDataStateProps } from "./applyDataStateProps.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";
import { sanitizeHref } from "@clerk/shared/internal/clerk-js/url";

//#region src/primitives/Link.tsx
const { applyVariants, filterProps } = createVariants((theme) => ({
	base: {
		boxSizing: "border-box",
		display: "inline-flex",
		alignItems: "center",
		margin: 0,
		cursor: "pointer",
		...common.disabled(theme),
		textDecoration: "none",
		"&:hover": { textDecoration: "underline" }
	},
	variants: {
		variant: common.textVariants(theme),
		colorScheme: {
			primary: {
				color: theme.colors.$primary500,
				"&:hover": { color: theme.colors.$primary400 },
				"&:active": { color: theme.colors.$primary600 }
			},
			danger: {
				color: theme.colors.$danger500,
				"&:hover": { color: theme.colors.$danger400 },
				"&:active": { color: theme.colors.$danger600 }
			},
			neutral: { color: theme.colors.$colorMutedForeground },
			inherit: { color: "inherit" }
		},
		focusRing: { true: { "&:focus-visible": {
			outline: "none",
			...common.focusRingStyles(theme)
		} } }
	},
	defaultVariants: {
		colorScheme: "primary",
		variant: "body",
		focusRing: false
	}
}));
const Link = (props) => {
	const { isExternal, children, href, onClick, ...rest } = props;
	const sanitizedHref = sanitizeHref(href);
	const onClickHandler = onClick ? (e) => {
		if (!sanitizedHref) e.preventDefault();
		onClick(e);
	} : void 0;
	return /* @__PURE__ */ jsx("a", {
		...applyDataStateProps(filterProps(rest)),
		onClick: onClickHandler,
		href: sanitizedHref || "",
		target: sanitizedHref && isExternal ? "_blank" : void 0,
		rel: sanitizedHref && isExternal ? "noopener noreferrer" : void 0,
		css: applyVariants(props),
		children
	});
};

//#endregion
export { Link };
//# sourceMappingURL=Link.js.map