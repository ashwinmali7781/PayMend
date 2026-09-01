//#region src/utils/truncateTextWithEndVisible.ts
/**
* Truncates a string to show the beginning and the last N characters,
* with an ellipsis in the middle.
*
* @param {string} str - The string to truncate
* @param {number} maxLength - Maximum total length of the truncated string (including ellipsis). Default is 20.
* @param {number} endChars - Number of characters to preserve at the end. Default is 5.
* @return {string} - Truncated string with ellipsis in the middle
*
* @example
* truncateWithEndVisible('this is a very long string') // returns 'this is a ve...ring'
* truncateWithEndVisible('test@email.com', 10) // returns 'te...e.com'
*/
function truncateWithEndVisible(str, maxLength = 20, endChars = 5) {
	const ELLIPSIS = "...";
	const ELLIPSIS_LENGTH = 3;
	if (!str) return str;
	const chars = Array.from(str);
	if (chars.length <= maxLength) return str;
	if (maxLength <= endChars + ELLIPSIS_LENGTH) return ELLIPSIS + chars.slice(-endChars).join("");
	const beginLength = maxLength - endChars - ELLIPSIS_LENGTH;
	const beginPortion = chars.slice(0, beginLength).join("");
	const endPortion = chars.slice(-endChars).join("");
	return beginPortion + ELLIPSIS + endPortion;
}

//#endregion
export { truncateWithEndVisible };
//# sourceMappingURL=truncateTextWithEndVisible.js.map