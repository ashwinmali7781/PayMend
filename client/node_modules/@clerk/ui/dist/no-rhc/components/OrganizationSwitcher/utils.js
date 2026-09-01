//#region src/components/OrganizationSwitcher/utils.ts
const organizationListParams = {
	userMemberships: { infinite: true },
	userInvitations: { infinite: true },
	userSuggestions: {
		infinite: true,
		status: ["pending", "accepted"]
	}
};
const populateCacheUpdateItem = (updatedItem, itemsInfinitePages, affectTotalCount) => {
	if (typeof itemsInfinitePages === "undefined") return [{
		data: [updatedItem],
		total_count: 1
	}];
	const prevTotalCount = itemsInfinitePages?.[itemsInfinitePages.length - 1]?.total_count || 1;
	/**
	* We should "preserve" an undefined page if one is found. For example if infinite loading triggers 2 requests, page 1 & page 2, and the request for page 2 resolves first, at that point in memory itemsInfinitePages would look like this [undefined, {....}]
	* If the hook says it has fetched 2 pages but the first result is undefined, we should not return back an array with 1 item as this will end up having cacheKeys that point nowhere.
	*/
	return itemsInfinitePages.map((item) => {
		if (typeof item === "undefined") return item;
		const newData = item.data.map((obj) => {
			if (obj.id === updatedItem.id) return { ...updatedItem };
			return obj;
		});
		return {
			...item,
			data: newData,
			total_count: affectTotalCount === "negative" ? prevTotalCount - 1 : prevTotalCount
		};
	});
};

//#endregion
export { organizationListParams, populateCacheUpdateItem };
//# sourceMappingURL=utils.js.map