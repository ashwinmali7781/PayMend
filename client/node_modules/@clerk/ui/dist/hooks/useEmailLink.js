import React from "react";

//#region src/hooks/useEmailLink.ts
function useEmailLink(resource) {
	const { startEmailLinkFlow, cancelEmailLinkFlow } = React.useMemo(() => resource.createEmailLinkFlow(), [resource]);
	React.useEffect(() => {
		return cancelEmailLinkFlow;
	}, []);
	return {
		startEmailLinkFlow,
		cancelEmailLinkFlow
	};
}

//#endregion
export { useEmailLink };
//# sourceMappingURL=useEmailLink.js.map