import { useConfigureSSO } from "../../../ConfigureSSOContext.js";
import { Wizard } from "../../../elements/Wizard/Wizard.js";
import { OidcCredentialsStep } from "./shared/OidcCredentialsStep.js";
import { OidcEndpointsStep } from "./shared/OidcEndpointsStep.js";
import { OidcRedirectUriStep } from "./shared/OidcRedirectUriStep.js";
import { useState } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/steps/ConfigureStep/oidc/OidcCustomConfigureSteps.tsx
const OIDC_STEPS = [
	{ id: "redirect-uri" },
	{ id: "endpoints" },
	{ id: "credentials" }
];
const OidcCustomConfigureSteps = () => {
	const { enterpriseConnection } = useConfigureSSO();
	const oauthConfig = enterpriseConnection?.oauthConfig;
	const [endpointMode, setEndpointMode] = useState(oauthConfig?.authUrl && !oauthConfig.discoveryUrl ? "manual" : "discoveryUrl");
	return /* @__PURE__ */ jsxs(Wizard, {
		steps: OIDC_STEPS,
		initialStepId: OIDC_STEPS[0].id,
		children: [
			/* @__PURE__ */ jsx(Wizard.Match, {
				id: "redirect-uri",
				children: /* @__PURE__ */ jsx(OidcRedirectUriStep, {})
			}),
			/* @__PURE__ */ jsx(Wizard.Match, {
				id: "endpoints",
				children: /* @__PURE__ */ jsx(OidcEndpointsStep, {
					mode: endpointMode,
					onModeChange: setEndpointMode
				})
			}),
			/* @__PURE__ */ jsx(Wizard.Match, {
				id: "credentials",
				children: /* @__PURE__ */ jsx(OidcCredentialsStep, { mode: endpointMode })
			})
		]
	});
};

//#endregion
export { OidcCustomConfigureSteps };
//# sourceMappingURL=OidcCustomConfigureSteps.js.map