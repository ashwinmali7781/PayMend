import { useRouter } from "../../router/RouteContext.js";
import { useClerk } from "@clerk/shared/react";

//#region src/contexts/components/SignOut.ts
const useSignOutContext = () => {
	const { navigate } = useRouter();
	const clerk = useClerk();
	const navigateAfterSignOut = () => navigate(clerk.buildAfterSignOutUrl());
	const navigateAfterMultiSessionSingleSignOutUrl = () => navigate(clerk.buildAfterMultiSessionSingleSignOutUrl());
	return {
		navigateAfterSignOut,
		navigateAfterMultiSessionSingleSignOutUrl,
		afterSignOutUrl: clerk.buildAfterSignOutUrl(),
		afterMultiSessionSingleSignOutUrl: clerk.buildAfterMultiSessionSingleSignOutUrl()
	};
};

//#endregion
export { useSignOutContext };
//# sourceMappingURL=SignOut.js.map