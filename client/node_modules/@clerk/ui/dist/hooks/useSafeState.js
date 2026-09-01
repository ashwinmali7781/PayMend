import React from "react";

//#region src/hooks/useSafeState.ts
function useSafeState(initialState) {
	const [state, _setState] = React.useState(initialState);
	const isMountedRef = React.useRef(true);
	React.useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);
	return [state, React.useCallback((currentState) => {
		if (!isMountedRef.current) return;
		_setState(currentState);
	}, [])];
}

//#endregion
export { useSafeState };
//# sourceMappingURL=useSafeState.js.map