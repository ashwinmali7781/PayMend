import React from "react";

//#region src/primitives/hooks/useInput.ts
function useInput(callback) {
	const ref = React.useRef(null);
	function onChange(e) {
		e.persist();
		if (typeof callback === "function") callback(e);
	}
	return {
		onChange,
		ref
	};
}

//#endregion
export { useInput };
//# sourceMappingURL=useInput.js.map