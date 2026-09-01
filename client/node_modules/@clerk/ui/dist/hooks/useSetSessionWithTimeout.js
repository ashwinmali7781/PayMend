import { useRouter } from "../router/RouteContext.js";
import { useSignInContext } from "../contexts/components/SignIn.js";
import { useEffect } from "react";
import { useClerk } from "@clerk/shared/react";

//#region src/hooks/useSetSessionWithTimeout.ts
const useSetSessionWithTimeout = (delay = 2e3) => {
	const { queryString } = useRouter();
	const { setActive } = useClerk();
	const { afterSignInUrl } = useSignInContext();
	useEffect(() => {
		let timeoutId;
		const createdSessionId = new URLSearchParams(queryString).get("createdSessionId");
		if (createdSessionId) timeoutId = setTimeout(() => {
			setActive({
				session: createdSessionId,
				redirectUrl: afterSignInUrl
			});
		}, delay);
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [
		setActive,
		afterSignInUrl,
		queryString
	]);
};

//#endregion
export { useSetSessionWithTimeout };
//# sourceMappingURL=useSetSessionWithTimeout.js.map