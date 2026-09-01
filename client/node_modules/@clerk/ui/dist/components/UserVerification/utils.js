//#region src/components/UserVerification/utils.ts
function sortByPrimaryFactor(a, b) {
	if ("primary" in a && a.primary && !("primary" in b && b.primary)) return -1;
	if ("primary" in b && b.primary && !("primary" in a && a.primary)) return 1;
	return 0;
}

//#endregion
export { sortByPrimaryFactor };
//# sourceMappingURL=utils.js.map