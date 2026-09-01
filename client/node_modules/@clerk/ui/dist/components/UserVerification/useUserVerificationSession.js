import { useFetch } from "../../hooks/useFetch.js";
import { useUserVerification } from "../../contexts/components/UserVerification.js";
import { LoadingCard } from "../../elements/LoadingCard.js";
import { useMemo } from "react";
import { useSession } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/useUserVerificationSession.tsx
const useUserVerificationSessionKey = () => {
	const { level } = useUserVerification();
	return useMemo(() => ({ level: level || "second_factor" }), [level]);
};
const useUserVerificationSession = () => {
	const { session } = useSession();
	const key = useUserVerificationSessionKey();
	return { ...useFetch(session ? session.startVerification : void 0, key, { throttleTime: 300 }) };
};
function withUserVerificationSessionGuard(Component) {
	const Hoc = (props) => {
		const { isLoading, data } = useUserVerificationSession();
		if (isLoading || !data) return /* @__PURE__ */ jsx(LoadingCard, {});
		return /* @__PURE__ */ jsx(Component, { ...props });
	};
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	Hoc.displayName = displayName;
	return Hoc;
}

//#endregion
export { useUserVerificationSession, withUserVerificationSessionGuard };
//# sourceMappingURL=useUserVerificationSession.js.map