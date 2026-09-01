//#region src/hooks/useDirection.ts
function getDirectionFromElement(element) {
	const dir = element.dir;
	if (dir === "rtl") return "rtl";
	if (dir === "ltr") return "ltr";
	if (dir === "auto" || !dir) {
		if (window.getComputedStyle(element).direction === "rtl") return "rtl";
	}
	return "ltr";
}
function useDirection(element) {
	if (typeof window === "undefined") return "ltr";
	if (element) return getDirectionFromElement(element);
	return getDirectionFromElement(document.documentElement);
}

//#endregion
export { useDirection };
//# sourceMappingURL=useDirection.js.map