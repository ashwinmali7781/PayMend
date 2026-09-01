import { useRouter } from "../../router/RouteContext.js";
import { useSignUpContext } from "../../contexts/components/SignUp.js";
import { completeSignUpFlow } from "./util.js";
import { useCallback } from "react";
import { useClerk } from "@clerk/shared/react";

//#region src/components/SignUp/useCompleteSignUpFlow.ts
const useCompleteSignUpFlow = () => {
	const { navigate } = useRouter();
	const { setActive } = useClerk();
	const { afterSignUpUrl, ssoCallbackUrl, oidcPrompt, navigateOnSetActive } = useSignUpContext();
	return useCallback(({ signUp, handleComplete, ...paths }) => completeSignUpFlow({
		...paths,
		signUp,
		navigate,
		redirectUrl: ssoCallbackUrl,
		redirectUrlComplete: afterSignUpUrl || "/",
		oidcPrompt,
		handleComplete: handleComplete ?? (() => setActive({
			session: signUp.createdSessionId,
			navigate: async ({ session, decorateUrl }) => {
				await navigateOnSetActive({
					session,
					redirectUrl: afterSignUpUrl,
					decorateUrl
				});
			}
		}))
	}), [
		navigate,
		setActive,
		afterSignUpUrl,
		ssoCallbackUrl,
		oidcPrompt,
		navigateOnSetActive
	]);
};

//#endregion
export { useCompleteSignUpFlow };
//# sourceMappingURL=useCompleteSignUpFlow.js.map