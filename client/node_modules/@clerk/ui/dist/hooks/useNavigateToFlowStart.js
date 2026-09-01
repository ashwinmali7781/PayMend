import { useRouter } from "../router/RouteContext.js";

//#region src/hooks/useNavigateToFlowStart.ts
const useNavigateToFlowStart = () => {
	const router = useRouter();
	const navigateToFlowStart = async () => {
		const to = router.indexPath;
		if (to !== router.currentPath) return router.navigate(to);
		if (router.urlStateParam?.path) return router.navigate("/" + router.basePath + router.urlStateParam?.startPath);
	};
	return { navigateToFlowStart };
};

//#endregion
export { useNavigateToFlowStart };
//# sourceMappingURL=useNavigateToFlowStart.js.map