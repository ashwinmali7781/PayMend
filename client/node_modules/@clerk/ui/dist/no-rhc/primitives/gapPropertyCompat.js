//#region src/primitives/gapPropertyCompat.ts
const createFlexGapPropertyIosCompat = (val, dir) => {
	if (navigator?.userAgent?.match(/(iphone|ipad).+(os).*(\s13_).+safari/i)) return { "& > *:not([hidden]):not([style*=\"visibility: hidden\"]) + *:not([hidden]):not([style*=\"visibility: hidden\"])": {
		marginInlineStart: dir === "row" ? val : void 0,
		marginTop: dir === "col" ? val : void 0
	} };
	return { gap: val };
};

//#endregion
export { createFlexGapPropertyIosCompat };
//# sourceMappingURL=gapPropertyCompat.js.map