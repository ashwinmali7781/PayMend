import { makeCustomizable } from "../customizables/makeCustomizable.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/InvisibleRootBox.tsx
const _InvisibleRootBox = React.memo((props) => {
	const [showSpan, setShowSpan] = React.useState(true);
	const parentRef = React.useRef(null);
	React.useEffect(() => {
		const parent = parentRef.current;
		if (!parent) return;
		if (showSpan) setShowSpan(false);
		parent.setAttribute("class", props.className);
		if ("isFlowReady" in props) parent.setAttribute("data-component-status", props.isFlowReady ? "ready" : "awaiting-data");
	}, [props.className, props.isFlowReady]);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [props.children, showSpan && /* @__PURE__ */ jsx("span", {
		ref: (el) => parentRef.current = el ? el.parentElement : parentRef.current,
		"aria-hidden": true,
		style: { display: "none" }
	})] });
});
const InvisibleRootBox = makeCustomizable(_InvisibleRootBox, { defaultStyles: (t) => ({
	boxSizing: "border-box",
	width: "fit-content",
	fontFamily: t.fonts.$main,
	fontStyle: t.fontStyles.$normal
}) });

//#endregion
export { InvisibleRootBox };
//# sourceMappingURL=InvisibleRootBox.js.map