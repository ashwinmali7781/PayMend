import { useClerk } from "@clerk/shared/react";

//#region src/hooks/useMultipleSessions.ts
const useMultipleSessions = (params) => {
	const signedInSessions = useClerk().client.signedInSessions;
	return {
		signedInSessions,
		otherSessions: signedInSessions.filter((s) => s.user?.id !== params.user?.id)
	};
};

//#endregion
export { useMultipleSessions };
//# sourceMappingURL=useMultipleSessions.js.map