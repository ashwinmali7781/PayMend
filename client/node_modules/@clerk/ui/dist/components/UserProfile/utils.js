//#region src/components/UserProfile/utils.ts
/**
* An attribute is "available" in the UserProfile if it's enabled for sign-up
* OR used as a first/second factor for sign-in. This covers instances where
* an attribute is disabled for sign-up but still used for authentication
* (e.g. accounts provisioned exclusively by invitation).
*/
function isAttributeAvailable(attr) {
	return Boolean(attr?.enabled || attr?.used_for_first_factor || attr?.used_for_second_factor);
}
const currentSessionFirst = (id) => (a) => a.id === id ? -1 : 1;
function sortIdentificationBasedOnVerification(array, primaryId) {
	if (!array) return [];
	const primaryItem = array.filter((item) => item.id === primaryId);
	const itemsWithoutPrimary = array.filter((item) => item.id !== primaryId);
	const verifiedItems = itemsWithoutPrimary.filter((item) => item.verification?.status === "verified");
	const unverifiedItems = itemsWithoutPrimary.filter((item) => !!item.verification?.status && item.verification?.status !== "verified");
	const unverifiedItemsWithoutVerification = itemsWithoutPrimary.filter((item) => !item.verification.status);
	verifiedItems.sort((a, b) => a.id.localeCompare(b.id));
	unverifiedItems.sort((a, b) => {
		if (!a.verification?.expireAt || !b.verification?.expireAt) return 0;
		return a.verification.expireAt.getTime() - b.verification.expireAt.getTime();
	});
	return [
		...primaryItem,
		...verifiedItems,
		...unverifiedItems,
		...unverifiedItemsWithoutVerification
	];
}

//#endregion
export { currentSessionFirst, isAttributeAvailable, sortIdentificationBasedOnVerification };
//# sourceMappingURL=utils.js.map