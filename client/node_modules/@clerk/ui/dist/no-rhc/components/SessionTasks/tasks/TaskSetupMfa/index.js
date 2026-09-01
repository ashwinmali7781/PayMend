import { useEnvironment } from "../../../../contexts/EnvironmentContext.js";
import { useSessionTasksContext, useTaskSetupMFAContext } from "../../../../contexts/components/SessionTasks.js";
import { withCoreSessionSwitchGuard } from "../../../../contexts/CoreSessionContext.js";
import { withCardStateProvider } from "../../../../elements/contexts/index.js";
import { Flow } from "../../../../customizables/Flow.js";
import { Wizard, useWizard } from "../../../../common/Wizard.js";
import { withTaskGuardOnlyOnMount } from "../shared/withTaskGuardOnlyOnMount.js";
import { getSecondFactorsAvailableToAdd } from "../../../../utils/mfa.js";
import { SetupMfaStartScreen } from "./SetupMfaStartScreen.js";
import { SmsCodeFlow } from "./SmsCodeFlowScreen.js";
import { TOTPCodeFlow } from "./TOTPCodeFlowScreen.js";
import { useEffect, useMemo } from "react";
import { useClerk, useSession, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskSetupMfa/index.tsx
const WIZARD_STEPS = {
	start: 0,
	phoneCode: 1,
	totp: 2
};
const TaskSetupMFAInternal = () => {
	const clerk = useClerk();
	const { user } = useUser();
	const { session } = useSession();
	const { userSettings: { attributes } } = useEnvironment();
	const secondFactorsAvailableToAdd = useMemo(() => {
		const availableMethods = user ? getSecondFactorsAvailableToAdd(attributes, user) : [];
		if (!user?.enterpriseAccounts || user.enterpriseAccounts.length === 0) return availableMethods;
		const firstEnterpriseConnection = user?.enterpriseAccounts[0];
		return availableMethods.filter((method) => {
			if (method === "phone_code") return firstEnterpriseConnection?.enterpriseConnection?.disableAdditionalIdentifications === false;
			return true;
		});
	}, [attributes, user]);
	const defaultStep = secondFactorsAvailableToAdd.indexOf("phone_code") > -1 ? WIZARD_STEPS.phoneCode : WIZARD_STEPS.totp;
	const wizard = useWizard({ defaultStep: secondFactorsAvailableToAdd.length > 1 ? WIZARD_STEPS.start : defaultStep });
	const { redirectUrlComplete } = useTaskSetupMFAContext();
	const { navigateOnSetActive, redirectOnActiveSession } = useSessionTasksContext();
	const handleSuccess = async () => {
		if (redirectOnActiveSession) redirectOnActiveSession.current = false;
		await clerk.setActive({
			session: session?.id,
			navigate: async ({ session, decorateUrl }) => {
				await navigateOnSetActive?.({
					session,
					redirectUrlComplete,
					decorateUrl
				});
			}
		});
	};
	useEffect(() => {
		if (redirectOnActiveSession) redirectOnActiveSession.current = false;
	}, [redirectOnActiveSession]);
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "taskSetupMfa",
		children: /* @__PURE__ */ jsxs(Wizard, {
			...wizard.props,
			animate: false,
			children: [
				/* @__PURE__ */ jsx(Flow.Part, {
					part: "methodSelectionMFA",
					children: /* @__PURE__ */ jsx(SetupMfaStartScreen, {
						availableMethods: secondFactorsAvailableToAdd,
						goToStep: wizard.goToStep
					})
				}),
				/* @__PURE__ */ jsx(Flow.Part, {
					part: "phoneCode2Fa",
					children: /* @__PURE__ */ jsx(SmsCodeFlow, {
						onSuccess: handleSuccess,
						goToStartStep: () => wizard.goToStep(0)
					})
				}),
				/* @__PURE__ */ jsx(Flow.Part, {
					part: "totp2Fa",
					children: /* @__PURE__ */ jsx(TOTPCodeFlow, {
						onSuccess: handleSuccess,
						goToStartStep: () => wizard.goToStep(0)
					})
				})
			]
		})
	});
};
const TaskSetupMFA = withCoreSessionSwitchGuard(withTaskGuardOnlyOnMount(withCardStateProvider(TaskSetupMFAInternal), "setup-mfa"));

//#endregion
export { TaskSetupMFA };
//# sourceMappingURL=index.js.map