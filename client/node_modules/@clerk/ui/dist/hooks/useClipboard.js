import { useCallback, useEffect, useState } from "react";
import copy from "copy-to-clipboard";

//#region src/hooks/useClipboard.ts
/**
* React hook to copy content to clipboard
*
* @param text the text or value to copy
* @param {Number} [optionsOrTimeout=1500] optionsOrTimeout - delay (in ms) to switch back to initial state once copied.
* @param {Object} optionsOrTimeout
* @param {string} optionsOrTimeout.format - set the desired MIME type
* @param {number} optionsOrTimeout.timeout - delay (in ms) to switch back to initial state once copied.
*/
function useClipboard(text, optionsOrTimeout = {}) {
	const [hasCopied, setHasCopied] = useState(false);
	const { timeout = 1500, ...copyOptions } = typeof optionsOrTimeout === "number" ? { timeout: optionsOrTimeout } : optionsOrTimeout;
	const onCopy = useCallback((overrideText) => {
		setHasCopied(copy(overrideText ?? text, copyOptions));
	}, [text, copyOptions]);
	useEffect(() => {
		let timeoutId = null;
		if (hasCopied) timeoutId = window.setTimeout(() => {
			setHasCopied(false);
		}, timeout);
		return () => {
			if (timeoutId) window.clearTimeout(timeoutId);
		};
	}, [timeout, hasCopied]);
	return {
		value: text,
		onCopy,
		hasCopied
	};
}

//#endregion
export { useClipboard };
//# sourceMappingURL=useClipboard.js.map