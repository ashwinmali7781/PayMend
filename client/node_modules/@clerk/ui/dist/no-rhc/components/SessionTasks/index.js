import { useRouter } from "../../router/RouteContext.js";
import { Route } from "../../router/Route.js";
import { Switch } from "../../router/Switch.js";
import { SessionTasksContext, TaskChooseOrganizationContext, TaskResetPasswordContext, TaskSetupMFAContext, useSessionTasksContext } from "../../contexts/components/SessionTasks.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Card } from "../../elements/Card/index.js";
import { LoadingCardContainer } from "../../elements/LoadingCard.js";
import { TaskChooseOrganization } from "./tasks/TaskChooseOrganization/index.js";
import { TaskResetPassword } from "./tasks/TaskResetPassword/index.js";
import { TaskSetupMFA } from "./tasks/TaskSetupMfa/index.js";
import { useEffect, useRef } from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { INTERNAL_SESSION_TASK_ROUTE_BY_KEY } from "@clerk/shared/internal/clerk-js/sessionTasks";
import { eventComponentMounted } from "@clerk/shared/telemetry";

//#region src/components/SessionTasks/index.tsx
const SessionTasksStart = () => {
	const clerk = useClerk();
	const { navigate } = useRouter();
	const { redirectUrlComplete } = useSessionTasksContext();
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const currentTaskKey = clerk.session?.currentTask?.key;
			if (!currentTaskKey) return;
			navigate(`./${INTERNAL_SESSION_TASK_ROUTE_BY_KEY[currentTaskKey]}`);
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [
		navigate,
		clerk,
		redirectUrlComplete
	]);
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "start",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsx(Card.Content, { children: /* @__PURE__ */ jsx(LoadingCardContainer, {}) }), /* @__PURE__ */ jsx(Card.Footer, {})] })
	});
};
function SessionTasksRoutes() {
	const ctx = useSessionTasksContext();
	const clerk = useClerk();
	const { navigate, currentPath } = useRouter();
	useEffect(() => {
		const task = clerk.session?.currentTask;
		if (!task || clerk.session?.status === "active") {
			if (ctx.redirectOnActiveSession?.current) navigate(ctx.redirectUrlComplete);
			return;
		}
		clerk.telemetry?.record(eventComponentMounted("SessionTask", { task: task.key }));
	}, [
		clerk,
		currentPath,
		navigate,
		ctx.redirectUrlComplete,
		ctx.redirectOnActiveSession
	]);
	if (!clerk.session?.currentTask && ctx.redirectOnActiveSession?.current) return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsx(Card.Content, {
		sx: () => ({ flex: 1 }),
		children: /* @__PURE__ */ jsx(LoadingCardContainer, {})
	}), /* @__PURE__ */ jsx(Card.Footer, {})] });
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "tasks",
		children: /* @__PURE__ */ jsxs(Switch, { children: [
			/* @__PURE__ */ jsx(Route, {
				path: INTERNAL_SESSION_TASK_ROUTE_BY_KEY["choose-organization"],
				children: /* @__PURE__ */ jsx(TaskChooseOrganizationContext.Provider, {
					value: {
						componentName: "TaskChooseOrganization",
						redirectUrlComplete: ctx.redirectUrlComplete
					},
					children: /* @__PURE__ */ jsx(TaskChooseOrganization, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: INTERNAL_SESSION_TASK_ROUTE_BY_KEY["reset-password"],
				children: /* @__PURE__ */ jsx(TaskResetPasswordContext.Provider, {
					value: {
						componentName: "TaskResetPassword",
						redirectUrlComplete: ctx.redirectUrlComplete
					},
					children: /* @__PURE__ */ jsx(TaskResetPassword, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: INTERNAL_SESSION_TASK_ROUTE_BY_KEY["setup-mfa"],
				children: /* @__PURE__ */ jsx(TaskSetupMFAContext.Provider, {
					value: {
						componentName: "TaskSetupMFA",
						redirectUrlComplete: ctx.redirectUrlComplete
					},
					children: /* @__PURE__ */ jsx(TaskSetupMFA, {})
				})
			}),
			/* @__PURE__ */ jsx(Route, {
				index: true,
				children: /* @__PURE__ */ jsx(SessionTasksStart, {})
			})
		] })
	});
}
/**
* @internal
*/
const SessionTasks = withCardStateProvider(({ redirectUrlComplete }) => {
	const redirectOnActiveSessionRef = useRef(true);
	return /* @__PURE__ */ jsx(SessionTasksContext.Provider, {
		value: {
			redirectUrlComplete,
			redirectOnActiveSession: redirectOnActiveSessionRef
		},
		children: /* @__PURE__ */ jsx(SessionTasksRoutes, {})
	});
});

//#endregion
export { SessionTasks };
//# sourceMappingURL=index.js.map