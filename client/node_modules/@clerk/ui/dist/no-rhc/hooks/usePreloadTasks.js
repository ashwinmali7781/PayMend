import { useEnvironment } from "../contexts/EnvironmentContext.js";
import { useFetch } from "./useFetch.js";

//#region src/hooks/usePreloadTasks.ts
/**
* Preloads tasks based on the environment settings
* @internal
*/
function usePreloadTasks() {
	const { organizationSettings } = useEnvironment();
	const hasTasks = organizationSettings.forceOrganizationSelection;
	useFetch(hasTasks ? () => import(
		/* webpackChunkName: "sessionTasks" */
		"../components/SessionTasks/index.js"
) : void 0, "preloadComponent", { staleTime: Infinity });
}

//#endregion
export { usePreloadTasks };
//# sourceMappingURL=usePreloadTasks.js.map