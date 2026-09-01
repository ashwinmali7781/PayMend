import { localizationKeys } from "../../../../localization/localizationKeys.js";
import { descriptors } from "../../../../customizables/elementDescriptors.js";
import { CardStateProvider } from "../../../../elements/contexts/index.js";
import { Flow } from "../../../../customizables/Flow.js";
import { useConfigureSSO } from "../../ConfigureSSOContext.js";
import { Step } from "../../elements/Step.js";
import { useWizard } from "../../elements/Wizard/WizardContext.js";
import { Wizard } from "../../elements/Wizard/Wizard.js";
import { isOidcProvider } from "../../domain/organizationEnterpriseConnection.js";
import { SelectProviderStep } from "../SelectProviderStep.js";
import { OidcCustomConfigureSteps } from "./oidc/OidcCustomConfigureSteps.js";
import { SamlCustomConfigureSteps } from "./saml/SamlCustomConfigureSteps.js";
import { SamlGoogleConfigureSteps } from "./saml/SamlGoogleConfigureSteps.js";
import { SamlMicrosoftConfigureSteps } from "./saml/SamlMicrosoftConfigureSteps.js";
import { SamlOktaConfigureSteps } from "./saml/SamlOktaConfigureSteps.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/steps/ConfigureStep/index.tsx
const STEPS_BY_SAML_PROVIDER = {
	saml_custom: SamlCustomConfigureSteps,
	saml_okta: SamlOktaConfigureSteps,
	saml_google: SamlGoogleConfigureSteps,
	saml_microsoft: SamlMicrosoftConfigureSteps
};
const resolveConfigureSteps = (provider) => isOidcProvider(provider) ? OidcCustomConfigureSteps : STEPS_BY_SAML_PROVIDER[provider];
const ConfigureStep = () => {
	const { organizationEnterpriseConnection: c } = useConfigureSSO();
	const { direction } = useWizard();
	return /* @__PURE__ */ jsxs(Wizard, {
		steps: React.useMemo(() => [{ id: "select-provider" }, {
			id: "configure-provider",
			isReachable: () => c.hasConnection
		}], [c]),
		initialStepId: direction === 1 ? "select-provider" : void 0,
		children: [/* @__PURE__ */ jsx(Wizard.Match, {
			id: "select-provider",
			children: /* @__PURE__ */ jsx(CardStateProvider, { children: /* @__PURE__ */ jsx(SelectProviderStep, {}) })
		}), /* @__PURE__ */ jsx(Wizard.Match, {
			id: "configure-provider",
			children: /* @__PURE__ */ jsx(CardStateProvider, { children: /* @__PURE__ */ jsx(ConfigureProviderStep, {}) })
		})]
	});
};
const ConfigureProviderStep = () => {
	const { organizationEnterpriseConnection: c } = useConfigureSSO();
	if (!c.provider) return null;
	const ConfigureSteps = resolveConfigureSteps(c.provider);
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "configureCreateApp",
		children: /* @__PURE__ */ jsx(Step, {
			elementDescriptor: descriptors.configureSSOStep,
			elementId: descriptors.configureSSOStep.setId("configure"),
			children: ConfigureSteps ? /* @__PURE__ */ jsx(ConfigureSteps, {}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Step.Header, {
				title: localizationKeys("configureSSO.configureStep.unsupportedProvider.title"),
				description: localizationKeys("configureSSO.configureStep.unsupportedProvider.description")
			}), /* @__PURE__ */ jsx(Step.Body, {})] })
		})
	});
};

//#endregion
export { ConfigureStep };
//# sourceMappingURL=index.js.map