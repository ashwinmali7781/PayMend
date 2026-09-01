import { useEffect, useState } from "react";

//#region src/hooks/useDebounce.ts
function useDebounce(value, delayInMs) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	const [timeoutState, setTimeoutState] = useState(void 0);
	useEffect(() => {
		const handleDebounce = () => {
			if (timeoutState) {
				clearTimeout(timeoutState);
				setTimeoutState(void 0);
			}
			setTimeoutState(setTimeout(() => {
				setDebouncedValue(value);
				setTimeoutState(void 0);
			}, delayInMs || 500));
		};
		handleDebounce();
		return () => {
			if (timeoutState) {
				clearTimeout(timeoutState);
				setTimeoutState(void 0);
			}
		};
	}, [JSON.stringify(value), delayInMs]);
	return debouncedValue;
}

//#endregion
export { useDebounce };
//# sourceMappingURL=useDebounce.js.map