import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Box } from "../customizables/index.js";
import { useEffect, useState } from "react";
import { jsx } from "@emotion/react/jsx-runtime";
import { inertProps } from "@clerk/shared/inert";

//#region src/elements/Collapsible.tsx
if (typeof CSS !== "undefined" && "registerProperty" in CSS) try {
	CSS.registerProperty({
		name: "--cl-collapsible-mask-size",
		syntax: "<length>",
		initialValue: "0px",
		inherits: false
	});
} catch {}
function Collapsible({ open, children, sx }) {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { animations } = useAppearance().parsedOptions;
	const isMotionSafe = !prefersReducedMotion && animations;
	const [shouldRender, setShouldRender] = useState(open);
	const [isExpanded, setIsExpanded] = useState(false);
	useEffect(() => {
		if (open) {
			setShouldRender(true);
			const frame = requestAnimationFrame(() => setIsExpanded(true));
			return () => cancelAnimationFrame(frame);
		}
		setIsExpanded(false);
		if (!isMotionSafe) setShouldRender(false);
	}, [open, isMotionSafe]);
	function handleTransitionEnd(e) {
		if (e.target !== e.currentTarget) return;
		if (!open) setShouldRender(false);
	}
	const isAnimating = shouldRender && !(open && isExpanded);
	if (!shouldRender) return null;
	return /* @__PURE__ */ jsx(Box, {
		elementDescriptor: descriptors.collapsible,
		onTransitionEnd: handleTransitionEnd,
		sx: [(t) => ({
			display: "grid",
			gridTemplateRows: isExpanded ? "1fr" : "0fr",
			opacity: isExpanded ? 1 : 0,
			transition: isMotionSafe ? `grid-template-rows ${t.transitionDuration.$fast} ease-out, opacity ${t.transitionDuration.$fast} ease-out` : "none"
		}), sx],
		...inertProps(!open),
		children: /* @__PURE__ */ jsx(Box, {
			elementDescriptor: descriptors.collapsibleInner,
			sx: (t) => ({
				overflow: "hidden",
				minHeight: 0,
				"--cl-collapsible-mask-size": isAnimating ? "0.5rem" : "0px",
				maskImage: "linear-gradient(to bottom, black, black calc(100% - var(--cl-collapsible-mask-size)), transparent)",
				transition: isMotionSafe ? `--cl-collapsible-mask-size ${t.transitionDuration.$slow}` : "none"
			}),
			children
		})
	});
}

//#endregion
export { Collapsible };
//# sourceMappingURL=Collapsible.js.map