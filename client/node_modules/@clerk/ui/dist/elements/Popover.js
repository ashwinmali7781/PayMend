import React from "react";
import { usePortalRoot } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx } from "@emotion/react/jsx-runtime";
import { FloatingFocusManager, FloatingNode, FloatingPortal } from "@floating-ui/react";

//#region src/elements/Popover.tsx
const Popover = (props) => {
	const { context, initialFocus, outsideElementsInert = false, order = ["reference", "content"], modal = true, nodeId, isOpen, portal = true, root, children } = props;
	const portalRoot = usePortalRoot();
	const effectiveRoot = root ?? portalRoot?.() ?? void 0;
	if (portal) return /* @__PURE__ */ jsx(FloatingNode, {
		id: nodeId,
		children: /* @__PURE__ */ jsx(FloatingPortal, {
			root: effectiveRoot,
			children: isOpen && /* @__PURE__ */ jsx(FloatingFocusManager, {
				context,
				initialFocus,
				outsideElementsInert,
				order,
				modal,
				children: /* @__PURE__ */ jsx(Fragment$1, { children })
			})
		})
	});
	return /* @__PURE__ */ jsx(FloatingNode, {
		id: nodeId,
		children: isOpen && /* @__PURE__ */ jsx(FloatingFocusManager, {
			context,
			initialFocus,
			order,
			modal,
			children: /* @__PURE__ */ jsx(Fragment$1, { children })
		})
	});
};

//#endregion
export { Popover };
//# sourceMappingURL=Popover.js.map