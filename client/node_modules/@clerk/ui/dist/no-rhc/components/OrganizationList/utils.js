//#region src/components/OrganizationList/utils.ts
const organizationListParams = {
	userMemberships: { infinite: true },
	userInvitations: { infinite: true },
	userSuggestions: {
		infinite: true,
		status: ["pending", "accepted"]
	}
};

//#endregion
export { organizationListParams };
//# sourceMappingURL=utils.js.map