import { Link } from "../customizables/index.js";
import React, { memo, useMemo } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/LinkRenderer.tsx
const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
const LinkRenderer = memo(({ text, ...linkProps }) => {
	const memoizedLinkProps = useMemo(() => linkProps, [linkProps]);
	return useMemo(() => {
		const parts = [];
		let lastIndex = 0;
		text.replace(LINK_REGEX, (match, linkText, url, offset) => {
			if (offset > lastIndex) parts.push(text.slice(lastIndex, offset));
			parts.push(/* @__PURE__ */ jsx(Link, {
				href: url,
				...memoizedLinkProps,
				children: linkText
			}, offset));
			lastIndex = offset + match.length;
			return match;
		});
		if (lastIndex < text.length) parts.push(text.slice(lastIndex));
		return parts;
	}, [text, memoizedLinkProps]);
});

//#endregion
export { LinkRenderer };
//# sourceMappingURL=LinkRenderer.js.map