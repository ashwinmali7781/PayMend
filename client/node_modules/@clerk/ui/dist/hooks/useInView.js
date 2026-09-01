import { useCallback, useRef, useState } from "react";

//#region src/hooks/useInView.ts
/**
* A custom React hook that provides the ability to track whether an element is in view
* based on the IntersectionObserver API.
*
* @param {IntersectionOptions} params - IntersectionObserver configuration options.
* @returns {{
*   inView: boolean,
*   ref: (element: HTMLElement | null) => void
* }} An object containing the current inView status and a ref function to attach to the target element.
*/
const useInView = (params) => {
	const [inView, setInView] = useState(false);
	const observerRef = useRef(null);
	const thresholds = Array.isArray(params.threshold) ? params.threshold : [params.threshold || 0];
	const internalOnChange = useRef();
	internalOnChange.current = params.onChange;
	return {
		inView,
		ref: useCallback((element) => {
			if (!element) {
				if (observerRef.current) observerRef.current.disconnect();
				return;
			}
			observerRef.current = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					const _inView = entry.isIntersecting && thresholds.some((threshold) => entry.intersectionRatio >= threshold);
					setInView(_inView);
					if (internalOnChange.current) internalOnChange.current(_inView, entry);
				});
			}, {
				root: params.root,
				rootMargin: params.rootMargin,
				threshold: thresholds
			});
			observerRef.current.observe(element);
		}, [])
	};
};

//#endregion
export { useInView };
//# sourceMappingURL=useInView.js.map