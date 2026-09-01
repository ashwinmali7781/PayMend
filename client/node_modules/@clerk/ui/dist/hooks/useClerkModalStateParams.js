import React from "react";
import { CLERK_MODAL_STATE } from "@clerk/shared/internal/clerk-js/constants";
import { removeClerkQueryParam } from "@clerk/shared/internal/clerk-js/queryParams";
import { readStateParam } from "@clerk/shared/internal/clerk-js/queryStateParams";

//#region src/hooks/useClerkModalStateParams.tsx
const useClerkModalStateParams = () => {
	const [state, setState] = React.useState({
		startPath: "",
		path: "",
		componentName: "",
		socialProvider: ""
	});
	const decodedRedirectParams = readStateParam();
	React.useLayoutEffect(() => {
		if (decodedRedirectParams) setState(decodedRedirectParams);
	}, []);
	const clearUrlStateParam = () => {
		setState({
			startPath: "",
			path: "",
			componentName: "",
			socialProvider: ""
		});
	};
	const removeQueryParam = () => removeClerkQueryParam(CLERK_MODAL_STATE);
	return {
		urlStateParam: {
			...state,
			clearUrlStateParam
		},
		decodedRedirectParams,
		clearUrlStateParam,
		removeQueryParam
	};
};

//#endregion
export { useClerkModalStateParams };
//# sourceMappingURL=useClerkModalStateParams.js.map