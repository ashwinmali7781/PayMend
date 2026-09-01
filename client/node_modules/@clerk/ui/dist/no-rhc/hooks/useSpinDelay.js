import { useSafeState } from "./useSafeState.js";
import { useEffect, useRef } from "react";

//#region src/hooks/useSpinDelay.ts
const DEFAULT_DELAY = 0;
const DEFAULT_MIN_DURATION_MS = 425;
/**
* Smooths a transient boolean flag (typically a loading/fetching state) so the consumer never
* shows a spinner that flickers on and off within a single frame.
*
* @example
*   const isFetching = useSomeQuery();
*   const showSpinner = useSpinDelay(isFetching, { delay: 0, minDuration: 425 });
*   return showSpinner ? <Spinner /> : <Icon />;
*/
function useSpinDelay(value, { delay = DEFAULT_DELAY, minDuration = DEFAULT_MIN_DURATION_MS } = {}) {
	const [displayed, setDisplayed] = useSafeState(false);
	const shownAtRef = useRef(null);
	useEffect(() => {
		if (value && !displayed) {
			const timeout = setTimeout(() => {
				shownAtRef.current = Date.now();
				setDisplayed(true);
			}, delay);
			return () => clearTimeout(timeout);
		}
		if (!value && displayed) {
			const elapsed = shownAtRef.current != null ? Date.now() - shownAtRef.current : minDuration;
			const remaining = Math.max(0, minDuration - elapsed);
			const timeout = setTimeout(() => {
				shownAtRef.current = null;
				setDisplayed(false);
			}, remaining);
			return () => clearTimeout(timeout);
		}
	}, [
		value,
		displayed,
		delay,
		minDuration,
		setDisplayed
	]);
	return displayed;
}

//#endregion
export { useSpinDelay };
//# sourceMappingURL=useSpinDelay.js.map