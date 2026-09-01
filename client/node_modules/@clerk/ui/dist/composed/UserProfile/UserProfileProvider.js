'use client';

import { UserProfileContext } from "../../contexts/components/UserProfile.js";
import { ProfileProviderShell, resolveComposedClerkRuntime } from "../ProfileProviderShell.js";
import { useClerk, useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/UserProfile/UserProfileProvider.tsx
const UserProfileProvider = (props) => {
	const { children, appearance, additionalOAuthScopes, apiKeysProps } = props;
	const clerk = useClerk();
	const { isLoaded, user } = useUser();
	const { environment, moduleManager } = resolveComposedClerkRuntime(clerk, isLoaded);
	if (!isLoaded || !user || !environment) return null;
	const userProfileCtxValue = {
		componentName: "UserProfile",
		mode: "mounted",
		routing: "hash",
		path: void 0,
		additionalOAuthScopes,
		apiKeysProps,
		customPages: []
	};
	return /* @__PURE__ */ jsx(ProfileProviderShell, {
		clerk,
		environment,
		moduleManager,
		appearanceKey: "userProfile",
		flow: "userProfile",
		globalAppearance: clerk.__internal_getOption("appearance"),
		appearance,
		children: /* @__PURE__ */ jsx(UserProfileContext.Provider, {
			value: userProfileCtxValue,
			children
		})
	});
};

//#endregion
export { UserProfileProvider };
//# sourceMappingURL=UserProfileProvider.js.map