'use client';

import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { OrganizationProfileContext } from "../../contexts/components/OrganizationProfile.js";
import { ProfileProviderShell, resolveComposedClerkRuntime } from "../ProfileProviderShell.js";
import { useClerk, useOrganization, useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/composed/OrganizationProfile/OrganizationProfileProvider.tsx
const OrganizationProfileProvider = (props) => {
	const { children, appearance, afterLeaveOrganizationUrl, apiKeysProps } = props;
	const clerk = useClerk();
	const { isLoaded, user } = useUser();
	const { organization } = useOrganization();
	const { environment, moduleManager } = resolveComposedClerkRuntime(clerk, isLoaded);
	if (!isLoaded || !user || !organization || !environment) return null;
	const orgProfileCtxValue = {
		componentName: "OrganizationProfile",
		mode: "mounted",
		routing: "hash",
		path: void 0,
		afterLeaveOrganizationUrl,
		apiKeysProps,
		customPages: []
	};
	return /* @__PURE__ */ jsx(ProfileProviderShell, {
		clerk,
		environment,
		moduleManager,
		appearanceKey: "organizationProfile",
		flow: "organizationProfile",
		globalAppearance: clerk.__internal_getOption("appearance"),
		appearance,
		children: /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
			value: "organization",
			children: /* @__PURE__ */ jsx(OrganizationProfileContext.Provider, {
				value: orgProfileCtxValue,
				children
			})
		})
	});
};

//#endregion
export { OrganizationProfileProvider };
//# sourceMappingURL=OrganizationProfileProvider.js.map