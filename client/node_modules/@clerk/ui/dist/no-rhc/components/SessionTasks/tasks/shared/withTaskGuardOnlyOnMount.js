import { useRouter } from "../../../../router/RouteContext.js";
import { useSessionTasksContext } from "../../../../contexts/components/SessionTasks.js";
import { useEffect, useRef } from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";
import { warnings } from "@clerk/shared/internal/clerk-js/warnings";
import { isDevelopmentFromPublishableKey } from "@clerk/shared/keys";

//#region src/components/SessionTasks/tasks/shared/withTaskGuardOnlyOnMount.tsx
/**
* Triggers a redirect if current task is not the given task key on initial mount only.
*
* Unlike the standard withTaskGuard, this guard captures the redirect condition on mount
* and does not re-evaluate it on subsequent renders. This allows tasks like setup-mfa to continue
* to still show the success screen after the task is completed mid-flow.
*
* If there's a current session, it will redirect to the `redirectUrlComplete` prop.
* If there's no current session, it will redirect to the sign in URL.
*
* @internal
*/
const withTaskGuardOnlyOnMount = (Component, taskKey) => {
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	const HOC = (props) => {
		const ctx = useSessionTasksContext();
		const clerk = useClerk();
		const { navigate } = useRouter();
		const shouldRedirectOnMount = useRef(null);
		if (shouldRedirectOnMount.current === null) shouldRedirectOnMount.current = !clerk.session?.currentTask || clerk.session.currentTask.key !== taskKey && !clerk.__internal_setActiveInProgress;
		useEffect(() => {
			if (shouldRedirectOnMount.current) {
				if (isDevelopmentFromPublishableKey(clerk.publishableKey)) console.info(warnings.cannotRenderComponentWhenTaskDoesNotExist);
				navigate(!clerk.session ? clerk.buildSignInUrl() : ctx.redirectUrlComplete ?? clerk.buildAfterSignInUrl());
			}
		}, []);
		if (shouldRedirectOnMount.current) return null;
		return /* @__PURE__ */ jsx(Component, { ...props });
	};
	HOC.displayName = `withTaskGuardOnlyOnMount(${displayName})`;
	return HOC;
};

//#endregion
export { withTaskGuardOnlyOnMount };
//# sourceMappingURL=withTaskGuardOnlyOnMount.js.map