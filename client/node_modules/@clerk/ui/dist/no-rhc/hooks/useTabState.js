import { useRouter } from "../router/RouteContext.js";
import { useEffect, useState } from "react";

//#region src/hooks/useTabState.ts
const useTabState = (tabMap, defaultTab = 0) => {
	const router = useRouter();
	const getInitialTab = () => {
		const tab = router.queryParams.tab;
		const tabIndex = Object.entries(tabMap).find(([_, value]) => value === tab)?.[0];
		return tabIndex ? parseInt(tabIndex, 10) : defaultTab;
	};
	const [selectedTab, setSelectedTab] = useState(getInitialTab());
	useEffect(() => {
		const currentTab = getInitialTab();
		if (currentTab !== selectedTab) setSelectedTab(currentTab);
	}, [router.queryParams.tab]);
	const handleTabChange = (index) => {
		setSelectedTab(index);
		const currentPath = router.currentPath;
		router.navigate(currentPath, { searchParams: new URLSearchParams({ tab: tabMap[index] || "" }) });
	};
	return {
		selectedTab,
		handleTabChange
	};
};

//#endregion
export { useTabState };
//# sourceMappingURL=useTabState.js.map