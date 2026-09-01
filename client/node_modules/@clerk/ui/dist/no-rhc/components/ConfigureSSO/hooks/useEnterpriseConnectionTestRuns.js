import { useCallback, useState } from "react";
import { __internal_useOrganizationEnterpriseConnectionTestRuns } from "@clerk/shared/react";

//#region src/components/ConfigureSSO/hooks/useEnterpriseConnectionTestRuns.ts
/** Page size for the paginated list; the success probe is a separate query. */
const TEST_RUNS_PAGE_SIZE = 5;
/**
* The single source of test-run state. Owns BOTH test-run concerns so the Test
* step never issues its own fetch:
*
* - the **success probe** (`status: ['success'], pageSize: 1`) →
*   `hasSuccessfulTestRun`;
* - the **paginated list** the table renders, plus the page cursor.
*
* Two loading signals separate a cold load from a background refetch: `isLoading`
* (first load only → full skeleton) vs `isFetching` (any in-flight LIST fetch
* with prior rows kept via `keepPreviousData` → table-level loading on re-entry).
*
* `active` gates BOTH queries. The umbrella hook derives it from the connection
* — `true` once configured (or active), which is also when the Test step becomes
* reachable. So an existing configured connection fetches on first load (covering
* the skeleton + the `tested` guard), while a merely-created-not-yet-configured
* connection stays `false`, never flashing the global skeleton for zero runs.
*/
const useEnterpriseConnectionTestRuns = (connection, active = true) => {
	const enterpriseConnectionId = connection?.id ?? null;
	const [page, setPage] = useState(1);
	const { data: successfulTestRuns, isLoading: isProbeLoading, revalidate: revalidateProbe } = __internal_useOrganizationEnterpriseConnectionTestRuns({
		enterpriseConnectionId,
		params: {
			initialPage: 1,
			pageSize: 1,
			status: ["success"]
		},
		enabled: active
	});
	const { data: listData, totalCount, isLoading: isListLoading, isFetching: isListFetching, isPolling, revalidate: revalidateList } = __internal_useOrganizationEnterpriseConnectionTestRuns({
		enterpriseConnectionId,
		params: {
			initialPage: page,
			pageSize: 5
		},
		enabled: active,
		keepPreviousData: true
	});
	const refresh = useCallback((options) => {
		const armPolling = options?.armPolling ?? false;
		return Promise.all([revalidateProbe({ armPolling: false }), revalidateList({ armPolling })]);
	}, [revalidateProbe, revalidateList]);
	const revalidateHasSuccessfulTestRun = useCallback(async () => {
		const { data } = await revalidateProbe({
			armPolling: false,
			exact: true
		});
		return (data?.length ?? 0) > 0;
	}, [revalidateProbe]);
	return {
		hasSuccessfulTestRun: (successfulTestRuns?.length ?? 0) > 0,
		isLoading: isProbeLoading || isListLoading,
		isFetching: isListFetching,
		rows: listData ?? [],
		totalCount: totalCount ?? 0,
		isPolling,
		page,
		setPage,
		refresh,
		revalidateHasSuccessfulTestRun
	};
};

//#endregion
export { useEnterpriseConnectionTestRuns };
//# sourceMappingURL=useEnterpriseConnectionTestRuns.js.map