import { useRouter } from "../../router/RouteContext.js";
import { useUserVerification } from "../../contexts/components/UserVerification.js";
import { useSupportEmail } from "../../hooks/useSupportEmail.js";
import { useUserVerificationSession } from "./useUserVerificationSession.js";
import { clerkInvalidFAPIResponse } from "@clerk/shared/internal/clerk-js/errors";
import { useCallback } from "react";
import { useClerk } from "@clerk/shared/react";

//#region src/components/UserVerification/use-after-verification.ts
const useAfterVerification = () => {
	const { afterVerification } = useUserVerification();
	const supportEmail = useSupportEmail();
	const { setActive } = useClerk();
	const { setCache } = useUserVerificationSession();
	const { navigate } = useRouter();
	return { handleVerificationResponse: useCallback(async (sessionVerification) => {
		setCache({
			data: sessionVerification,
			isLoading: false,
			isValidating: false,
			error: null,
			cachedAt: Date.now()
		});
		switch (sessionVerification.status) {
			case "complete":
				await setActive({ session: sessionVerification.session.id });
				return afterVerification?.();
			case "needs_second_factor": return navigate("./factor-two");
			default: return console.error(clerkInvalidFAPIResponse(sessionVerification.status, supportEmail));
		}
	}, [
		navigate,
		setActive,
		supportEmail
	]) };
};

//#endregion
export { useAfterVerification };
//# sourceMappingURL=use-after-verification.js.map