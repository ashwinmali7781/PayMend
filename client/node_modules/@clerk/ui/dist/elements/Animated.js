import { useAppearance } from "../customizables/AppearanceContext.js";
import { cloneElement, useCallback, useRef } from "react";
import { jsx } from "@emotion/react/jsx-runtime";
import autoAnimate from "@formkit/auto-animate";

//#region src/elements/Animated.tsx
function useSafeAutoAnimate() {
	const controllerRef = useRef(null);
	const nodeRef = useRef(null);
	return [useCallback((node) => {
		if (node && node === nodeRef.current && controllerRef.current) return;
		if (controllerRef.current) {
			controllerRef.current.destroy?.();
			controllerRef.current = null;
		}
		nodeRef.current = node;
		if (node instanceof HTMLElement && typeof node.animate === "function") controllerRef.current = autoAnimate(node);
	}, [])];
}
const Animated = (props) => {
	const { children, asChild } = props;
	const { animations } = useAppearance().parsedOptions;
	const [parent] = useSafeAutoAnimate();
	if (asChild) return cloneElement(children, { ref: animations ? parent : null });
	return /* @__PURE__ */ jsx("div", {
		ref: animations ? parent : null,
		children
	});
};

//#endregion
export { Animated };
//# sourceMappingURL=Animated.js.map