import { useEnvironment } from "../contexts/EnvironmentContext.js";
import { localizationKeys } from "../localization/localizationKeys.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { sanitizeInputProps, useFormField } from "../primitives/hooks/useFormField.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flex, FormLabel, Text } from "../customizables/index.js";
import { Field } from "./FieldControl.js";
import { LinkRenderer } from "./LinkRenderer.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/LegalConsentCheckbox.tsx
const LegalCheckboxLabel = (props) => {
	const { termsUrl, privacyPolicyUrl } = props;
	const { t } = useLocalizations();
	const { placeholder, ...inputProps } = sanitizeInputProps(useFormField());
	let localizationKey;
	if (termsUrl && privacyPolicyUrl) localizationKey = localizationKeys("signUp.legalConsent.checkbox.label__termsOfServiceAndPrivacyPolicy", {
		termsOfServiceLink: termsUrl,
		privacyPolicyLink: privacyPolicyUrl
	});
	else if (termsUrl) localizationKey = localizationKeys("signUp.legalConsent.checkbox.label__onlyTermsOfService", { termsOfServiceLink: termsUrl });
	else if (privacyPolicyUrl) localizationKey = localizationKeys("signUp.legalConsent.checkbox.label__onlyPrivacyPolicy", { privacyPolicyLink: privacyPolicyUrl });
	return /* @__PURE__ */ jsx(FormLabel, {
		elementDescriptor: descriptors.formFieldCheckboxLabel,
		htmlFor: inputProps.id,
		isDisabled: inputProps.isDisabled,
		sx: (t) => ({
			paddingInlineStart: t.space.$1x5,
			textAlign: "start"
		}),
		children: /* @__PURE__ */ jsx(Text, {
			variant: "body",
			as: "span",
			children: /* @__PURE__ */ jsx(LinkRenderer, {
				text: t(localizationKey),
				isExternal: true,
				sx: (t) => ({
					textDecoration: "underline",
					textUnderlineOffset: t.space.$1
				})
			})
		})
	});
};
const LegalCheckbox = (props) => {
	const { displayConfig } = useEnvironment();
	const { parsedOptions } = useAppearance();
	const termsLink = parsedOptions.termsPageUrl || displayConfig.termsUrl;
	const privacyPolicy = parsedOptions.privacyPageUrl || displayConfig.privacyPolicyUrl;
	return /* @__PURE__ */ jsx(Field.Root, {
		...props,
		children: /* @__PURE__ */ jsxs(Flex, {
			justify: "center",
			align: "start",
			children: [/* @__PURE__ */ jsx(Field.CheckboxIndicator, {
				elementDescriptor: descriptors.formFieldCheckboxInput,
				elementId: descriptors.formFieldInput.setId("legalAccepted")
			}), /* @__PURE__ */ jsx(LegalCheckboxLabel, {
				termsUrl: termsLink,
				privacyPolicyUrl: privacyPolicy
			})]
		})
	});
};

//#endregion
export { LegalCheckbox };
//# sourceMappingURL=LegalConsentCheckbox.js.map