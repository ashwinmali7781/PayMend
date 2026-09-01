import { useRouter } from "../router/RouteContext.js";
import React, { useEffect } from "react";
import { useSession } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx } from "@emotion/react/jsx-runtime";

//#region src/common/Gate.tsx
/**
* `useProtect` is just an abstraction on top of `useSession` that improves the internal DX for authorization
* @param params
*/
const useProtect = (params) => {
	const { session } = useSession();
	if (!session?.id) return false;
	if (typeof params === "function") return params(session.checkAuthorization);
	return session.checkAuthorization(params);
};
const Protect = (protectProps) => {
	const { children, fallback, redirectTo, ...restAuthorizedParams } = protectProps;
	const isAuthorizedUser = useProtect(typeof restAuthorizedParams.condition === "function" ? restAuthorizedParams.condition : restAuthorizedParams);
	const { navigate } = useRouter();
	useEffect(() => {
		if (!isAuthorizedUser && redirectTo) navigate(redirectTo);
	}, [isAuthorizedUser, redirectTo]);
	if (!isAuthorizedUser && fallback) return /* @__PURE__ */ jsx(Fragment$1, { children: fallback });
	if (isAuthorizedUser) return /* @__PURE__ */ jsx(Fragment$1, { children });
	return null;
};
function withProtect(Component, protectProps) {
	const displayName = Component.displayName || Component.name || "Component";
	const HOC = (props) => {
		return /* @__PURE__ */ jsx(Protect, {
			...protectProps,
			children: /* @__PURE__ */ jsx(Component, { ...props })
		});
	};
	HOC.displayName = `withProtect(${displayName})`;
	return HOC;
}

//#endregion
export { Protect, useProtect, withProtect };
//# sourceMappingURL=Gate.js.map