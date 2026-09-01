//#region src/utils/mfa.ts
const defaultFirst = (a) => a.defaultSecondFactor ? -1 : 1;
function getSecondFactors(attributes) {
	const secondFactors = [];
	Object.entries(attributes).forEach(([, attr]) => {
		if (attr?.used_for_second_factor && attr.second_factors) secondFactors.push(...attr.second_factors);
	});
	return secondFactors;
}
function getSecondFactorsAvailableToAdd(attributes, user) {
	let sfs = getSecondFactors(attributes);
	if (user.totpEnabled) sfs = sfs.filter((f) => f !== "totp");
	if (user.backupCodeEnabled || !user.twoFactorEnabled) sfs = sfs.filter((f) => f !== "backup_code");
	return sfs;
}

//#endregion
export { defaultFirst, getSecondFactors, getSecondFactorsAvailableToAdd };
//# sourceMappingURL=mfa.js.map