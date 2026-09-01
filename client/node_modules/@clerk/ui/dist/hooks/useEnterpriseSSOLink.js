import React from "react";

//#region src/hooks/useEnterpriseSSOLink.ts
function useEnterpriseSSOLink(resource) {
	const { startEnterpriseSSOLinkFlow, cancelEnterpriseSSOLinkFlow } = React.useMemo(() => resource.createEnterpriseSSOLinkFlow(), [resource]);
	React.useEffect(() => {
		return cancelEnterpriseSSOLinkFlow;
	}, []);
	return {
		startEnterpriseSSOLinkFlow,
		cancelEnterpriseSSOLinkFlow
	};
}

//#endregion
export { useEnterpriseSSOLink };
//# sourceMappingURL=useEnterpriseSSOLink.js.map