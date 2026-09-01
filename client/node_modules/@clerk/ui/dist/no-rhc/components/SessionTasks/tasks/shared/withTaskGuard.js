import { useSessionTasksContext } from "../../../../contexts/components/SessionTasks.js";
import { withRedirect } from "../../../../common/withRedirect.js";
import { warnings } from "@clerk/shared/internal/clerk-js/warnings";

//#region src/components/SessionTasks/tasks/shared/withTaskGuard.ts
/**
* Triggers a redirect if current task is not the given task key.
*
* If there's a current session, it will redirect to the `redirectUrlComplete` prop.
* If there's no current session, it will redirect to the sign in URL.
*
* @internal
*/
const withTaskGuard = (Component, taskKey) => {
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	const HOC = (props) => {
		const ctx = useSessionTasksContext();
		return withRedirect(Component, (clerk) => !clerk.session?.currentTask || clerk.session.currentTask.key !== taskKey && !clerk.__internal_setActiveInProgress, ({ clerk }) => !clerk.session ? clerk.buildSignInUrl() : ctx.redirectUrlComplete ?? clerk.buildAfterSignInUrl(), warnings.cannotRenderComponentWhenTaskDoesNotExist)(props);
	};
	HOC.displayName = `withTaskGuard(${displayName})`;
	return HOC;
};

//#endregion
export { withTaskGuard };
//# sourceMappingURL=withTaskGuard.js.map