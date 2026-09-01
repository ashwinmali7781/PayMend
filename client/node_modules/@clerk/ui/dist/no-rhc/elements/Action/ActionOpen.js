import { useActionContext } from "./ActionRoot.js";
import React, { useEffect, useRef } from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/Action/ActionOpen.tsx
const ScrollWrapper = React.forwardRef((props, ref) => /* @__PURE__ */ jsx("div", {
	ref,
	...props
}));
const ActionOpen = ({ children, value }) => {
	const { active } = useActionContext();
	const ref = useRef(null);
	useEffect(() => {
		const element = ref.current;
		const observer = new MutationObserver(() => {
			observer.disconnect();
			if (!element) return;
			setTimeout(() => {
				element.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
			}, 300);
		});
		if (active === value && element) observer.observe(element, {
			childList: true,
			subtree: true,
			attributes: true
		});
		return () => observer.disconnect();
	}, [active, value]);
	if (active !== value) return null;
	return /* @__PURE__ */ jsx(ScrollWrapper, {
		ref,
		children
	});
};

//#endregion
export { ActionOpen };
//# sourceMappingURL=ActionOpen.js.map