import { useEffect, useState } from "react";

//#region src/hooks/usePrefersReducedMotion.ts
const mediaQueryNoPreference = "(prefers-reduced-motion: no-preference)";
const getInitialValue = () => {
	if (typeof window === "undefined") return true;
	return !window.matchMedia(mediaQueryNoPreference).matches;
};
function usePrefersReducedMotion() {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialValue);
	useEffect(() => {
		const mediaQueryList = window.matchMedia(mediaQueryNoPreference);
		setPrefersReducedMotion(!window.matchMedia(mediaQueryNoPreference).matches);
		const listener = (event) => {
			setPrefersReducedMotion(!event.matches);
		};
		const addListenerCompat = (event, handler) => {
			if ("addEventListener" in mediaQueryList) return mediaQueryList.addEventListener(event, handler);
			else return mediaQueryList.addListener(handler);
		};
		const removeListenerCompat = (event, handler) => {
			if ("addEventListener" in mediaQueryList) return mediaQueryList.removeEventListener(event, handler);
			else return mediaQueryList.removeListener(handler);
		};
		addListenerCompat("change", listener);
		return () => removeListenerCompat("change", listener);
	}, []);
	return prefersReducedMotion;
}

//#endregion
export { usePrefersReducedMotion };
//# sourceMappingURL=usePrefersReducedMotion.js.map