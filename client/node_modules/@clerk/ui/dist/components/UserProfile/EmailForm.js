import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { isAttributeAvailable } from "./utils.js";
import { VerifyWithCode } from "./VerifyWithCode.js";
import { VerifyWithEnterpriseConnection } from "./VerifyWithEnterpriseConnection.js";
import { VerifyWithLink } from "./VerifyWithLink.js";
import React from "react";
import { useReverification, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/EmailForm.tsx
const EmailForm = withCardStateProvider((props) => {
	const { emailId: id, onSuccess, onReset, disableAutoFocus = false } = props;
	const card = useCardState();
	const { user } = useUser();
	const environment = useEnvironment();
	const createEmailAddress = useReverification((email) => user?.createEmailAddress({ email }));
	const emailAddressRef = React.useRef(user?.emailAddresses.find((a) => a.id === id));
	const strategy = getEmailAddressVerificationStrategy(emailAddressRef.current, environment);
	const wizard = useWizard({
		defaultStep: emailAddressRef.current ? 1 : 0,
		onNextStep: () => card.setError(void 0)
	});
	const emailField = useFormControl("emailAddress", "", {
		type: "email",
		label: localizationKeys("formFieldLabel__emailAddress"),
		placeholder: localizationKeys("formFieldInputPlaceholder__emailAddress"),
		isRequired: true
	});
	const canSubmit = emailField.value.length > 1 && user?.username !== emailField.value;
	const addEmail = async (e) => {
		e.preventDefault();
		if (!user) return;
		return createEmailAddress(emailField.value).then((res) => {
			emailAddressRef.current = res;
			wizard.nextStep();
		}).catch((e) => handleError(e, [emailField], card.setError));
	};
	const translationKey = getTranslationKeyByStrategy(strategy);
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [/* @__PURE__ */ jsx(FormContainer, {
			headerTitle: props.title || localizationKeys("userProfile.emailAddressPage.title"),
			headerSubtitle: props.subtitle || localizationKeys("userProfile.emailAddressPage.formHint"),
			children: /* @__PURE__ */ jsxs(Form.Root, {
				onSubmit: addEmail,
				children: [/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: emailField.id,
					children: /* @__PURE__ */ jsx(Form.PlainInput, {
						...emailField.props,
						autoFocus: !disableAutoFocus
					})
				}), /* @__PURE__ */ jsx(FormButtons, {
					submitLabel: localizationKeys("userProfile.formButtonPrimary__add"),
					isDisabled: !canSubmit,
					onReset
				})]
			})
		}), /* @__PURE__ */ jsxs(FormContainer, {
			headerTitle: localizationKeys("userProfile.emailAddressPage.verifyTitle"),
			headerSubtitle: localizationKeys(`${translationKey}.formSubtitle`, { identifier: emailAddressRef.current?.emailAddress || "" }),
			children: [
				strategy === "email_link" && /* @__PURE__ */ jsx(VerifyWithLink, {
					nextStep: onSuccess,
					email: emailAddressRef.current,
					onReset
				}),
				strategy === "email_code" && /* @__PURE__ */ jsx(VerifyWithCode, {
					nextStep: onSuccess,
					identification: emailAddressRef.current,
					identifier: emailAddressRef.current?.emailAddress,
					prepareVerification: () => emailAddressRef.current?.prepareVerification({ strategy: "email_code" }),
					onReset
				}),
				strategy === "enterprise_sso" && /* @__PURE__ */ jsx(VerifyWithEnterpriseConnection, {
					nextStep: onSuccess,
					email: emailAddressRef.current,
					onReset
				})
			]
		})]
	});
});
const getTranslationKeyByStrategy = (strategy) => {
	switch (strategy) {
		case "email_code": return "userProfile.emailAddressPage.emailCode";
		case "enterprise_sso": return "userProfile.emailAddressPage.enterpriseSSOLink";
		case "email_link": return "userProfile.emailAddressPage.emailLink";
		default: throw new Error(`Unsupported strategy for email verification: ${strategy}`);
	}
};
function isEmailLinksEnabledForInstance(env) {
	const { userSettings } = env;
	const { email_address } = userSettings.attributes;
	return Boolean(isAttributeAvailable(email_address) && email_address?.verifications.includes("email_link"));
}
/**
* Determines the email verification strategy based on the email address resource
* and instance
*
* @returns The verification strategy to use:
*  - 'enterprise_sso' - If the email domain matches an enterprise SSO connection
*  - 'email_link' - If email link verification is enabled for the instance
*  - 'email_code' - Fallback strategy when email links are disabled
*/
const getEmailAddressVerificationStrategy = (emailAddress, env) => {
	if (emailAddress?.matchesSsoConnection) return "enterprise_sso";
	return isEmailLinksEnabledForInstance(env) ? "email_link" : "email_code";
};

//#endregion
export { EmailForm };
//# sourceMappingURL=EmailForm.js.map