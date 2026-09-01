import { useEffect, useRef } from "react";

//#region src/components/APIKeys/utils.ts
/**
* Hook that manages pagination logic for API keys:
* - Resets to page 1 when query changes
* - Adjusts page when current page exceeds available pages (e.g., after deletion)
* - Provides cache invalidation function for mutations
*/
const useAPIKeysPagination = ({ query, page, pageCount, isFetching, fetchPage }) => {
	const previousQueryRef = useRef(query);
	useEffect(() => {
		if (previousQueryRef.current !== query) {
			previousQueryRef.current = query;
			fetchPage(1);
		}
	}, [query, fetchPage]);
	useEffect(() => {
		if (!isFetching && pageCount > 0 && page > pageCount) fetchPage(Math.max(1, pageCount));
	}, [
		pageCount,
		page,
		isFetching,
		fetchPage
	]);
};

//#endregion
export { useAPIKeysPagination };
//# sourceMappingURL=utils.js.map