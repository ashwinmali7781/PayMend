import { Route } from "../../router/Route.js";
import { Switch } from "../../router/Switch.js";
import { UserVerificationContext } from "../../contexts/components/UserVerification.js";
import { withCoreSessionSwitchGuard } from "../../contexts/CoreSessionContext.js";
import { Flow } from "../../customizables/Flow.js";
import { useUserVerificationSession } from "./useUserVerificationSession.js";
import { UserVerificationFactorOne } from "./UserVerificationFactorOne.js";
import { UserVerificationFactorTwo } from "./UserVerificationFactorTwo.js";
import React, { useEffect } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserVerification/index.tsx
function UserVerificationRoutes() {
	const { invalidate } = useUserVerificationSession();
	useEffect(() => {
		return () => {
			invalidate();
		};
	}, []);
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "userVerification",
		children: /* @__PURE__ */ jsxs(Switch, { children: [/* @__PURE__ */ jsx(Route, {
			path: "factor-two",
			children: /* @__PURE__ */ jsx(UserVerificationFactorTwo, {})
		}), /* @__PURE__ */ jsx(Route, {
			index: true,
			children: /* @__PURE__ */ jsx(UserVerificationFactorOne, {})
		})] })
	});
}
UserVerificationRoutes.displayName = "UserVerification";
const UserVerification = withCoreSessionSwitchGuard(UserVerificationRoutes);
const UserVerificationModal = (props) => {
	return /* @__PURE__ */ jsx(Route, {
		path: "user-verification",
		children: /* @__PURE__ */ jsx(UserVerificationContext.Provider, {
			value: {
				componentName: "UserVerification",
				...props,
				routing: "virtual"
			},
			children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(UserVerification, {
				...props,
				routing: "virtual"
			}) })
		})
	});
};

//#endregion
export { UserVerification, UserVerificationModal };
//# sourceMappingURL=index.js.map