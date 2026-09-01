import { useLocalizations } from "../localization/makeLocalizable.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { Box } from "../customizables/index.js";
import { useEffect, useRef, useState } from "react";
import { CAPTCHA_ELEMENT_ID } from "@clerk/shared/internal/clerk-js/constants";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/CaptchaElement.tsx
/**
* This component uses a MutationObserver to listen for DOM changes made by our Turnstile logic,
* which operates outside the React lifecycle. It stores the observed state in refs to ensure that
* any external style changes, such as updates to max-height, min-height, or margin-bottom persist across re-renders,
* preventing unwanted layout resets.
*
* When Turnstile escalates to an interactive "Verify you are human" challenge it sets
* `data-cl-interactive="true"` on the element (removed on resolve/error). `onInteractiveChange`
* surfaces that signal so a parent can react (e.g. spotlight the challenge); it never fires on mount.
*/
const CaptchaElement = ({ onInteractiveChange, gapless }) => {
	const elementRef = useRef(null);
	const maxHeightValueRef = useRef("0");
	const minHeightValueRef = useRef("unset");
	const marginBottomValueRef = useRef("unset");
	const [isInteractive, setIsInteractive] = useState(false);
	const onInteractiveChangeRef = useRef(onInteractiveChange);
	onInteractiveChangeRef.current = onInteractiveChange;
	const isInteractiveRef = useRef(false);
	const { parsedCaptcha } = useAppearance();
	const { locale } = useLocalizations();
	const captchaTheme = parsedCaptcha?.theme;
	const captchaSize = parsedCaptcha?.size;
	const captchaLanguage = parsedCaptcha?.language || locale?.toLowerCase();
	useEffect(() => {
		if (!elementRef.current) return;
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				const target = mutation.target;
				if (mutation.type !== "attributes" || !elementRef.current) return;
				if (mutation.attributeName === "style") {
					maxHeightValueRef.current = target.style.maxHeight || "0";
					minHeightValueRef.current = target.style.minHeight || "unset";
					marginBottomValueRef.current = target.style.marginBottom || "unset";
					if (!("clInteractive" in target.dataset)) {
						const mh = target.style.maxHeight;
						const nowInteractive = mh !== "" && mh !== "0" && mh !== "0px";
						if (nowInteractive !== isInteractiveRef.current) {
							isInteractiveRef.current = nowInteractive;
							setIsInteractive(nowInteractive);
							onInteractiveChangeRef.current?.(nowInteractive);
						}
					}
				}
				if (mutation.attributeName === "data-cl-interactive") {
					const nowInteractive = target.dataset.clInteractive === "true";
					if (nowInteractive !== isInteractiveRef.current) {
						isInteractiveRef.current = nowInteractive;
						setIsInteractive(nowInteractive);
						onInteractiveChangeRef.current?.(nowInteractive);
					}
				}
			});
		});
		observer.observe(elementRef.current, {
			attributes: true,
			attributeFilter: ["style", "data-cl-interactive"]
		});
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ jsx(Box, {
		ref: elementRef,
		id: CAPTCHA_ELEMENT_ID,
		style: {
			display: "block",
			alignSelf: "center",
			maxHeight: maxHeightValueRef.current,
			minHeight: minHeightValueRef.current,
			marginBottom: marginBottomValueRef.current,
			position: gapless ? isInteractive ? "static" : "absolute" : void 0
		},
		"data-cl-theme": captchaTheme,
		"data-cl-size": captchaSize,
		"data-cl-language": captchaLanguage
	});
};

//#endregion
export { CaptchaElement };
//# sourceMappingURL=CaptchaElement.js.map