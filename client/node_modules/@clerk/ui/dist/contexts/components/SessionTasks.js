import { useRouter } from "../../router/RouteContext.js";
import { VIRTUAL_ROUTER_BASE_PATH } from "../../router/VirtualRouter.js";
import { clerkWindowNavigate } from "../../utils/windowNavigate.js";
import { createContext, useContext } from "react";
import { useClerk } from "@clerk/shared/react";
import { buildTaskUrl, getTaskEndpoint } from "@clerk/shared/internal/clerk-js/sessionTasks";

//#region src/contexts/components/SessionTasks.ts
const SessionTasksContext = createContext(null);
const useSessionTasksContext = () => {
	const context = useContext(SessionTasksContext);
	const { navigate, basePath, startPath } = useRouter();
	const clerk = useClerk();
	if (context === null) throw new Error("Clerk: useSessionTasksContext called outside of the mounted SessionTasks component.");
	const navigateOnSetActive = async ({ session, redirectUrlComplete, decorateUrl }) => {
		const currentTask = session.currentTask;
		if (!currentTask) {
			const decoratedUrl = decorateUrl(redirectUrlComplete);
			if (decoratedUrl !== redirectUrlComplete && /^https?:\/\//.test(decoratedUrl)) {
				clerkWindowNavigate(clerk, decoratedUrl);
				return;
			}
			return navigate(redirectUrlComplete);
		}
		const customTaskUrl = clerk.__internal_getOption("taskUrls")?.[currentTask.key];
		if (customTaskUrl) return navigate(customTaskUrl);
		const taskEndpoint = getTaskEndpoint(currentTask);
		if (basePath === VIRTUAL_ROUTER_BASE_PATH) return navigate(`/${basePath + startPath + taskEndpoint}`);
		return navigate(buildTaskUrl(currentTask, { base: clerk.buildSignInUrl() }));
	};
	return {
		...context,
		navigateOnSetActive
	};
};
const TaskChooseOrganizationContext = createContext(null);
const useTaskChooseOrganizationContext = () => {
	const context = useContext(TaskChooseOrganizationContext);
	if (context === null) throw new Error("Clerk: useTaskChooseOrganizationContext called outside of the mounted TaskChooseOrganization component.");
	return context;
};
const TaskResetPasswordContext = createContext(null);
const useTaskResetPasswordContext = () => {
	const context = useContext(TaskResetPasswordContext);
	if (context === null) throw new Error("Clerk: useTaskResetPasswordContext called outside of the mounted TaskResetPassword component.");
	return context;
};
const TaskSetupMFAContext = createContext(null);
const useTaskSetupMFAContext = () => {
	const context = useContext(TaskSetupMFAContext);
	if (context === null) throw new Error("Clerk: useTaskSetupMFAContext called outside of the mounted TaskSetupMFA component.");
	return context;
};

//#endregion
export { SessionTasksContext, TaskChooseOrganizationContext, TaskResetPasswordContext, TaskSetupMFAContext, useSessionTasksContext, useTaskChooseOrganizationContext, useTaskResetPasswordContext, useTaskSetupMFAContext };
//# sourceMappingURL=SessionTasks.js.map