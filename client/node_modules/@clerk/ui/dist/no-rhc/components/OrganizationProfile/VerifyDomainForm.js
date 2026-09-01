import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { useFetch } from "../../hooks/useFetch.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Button, Flex, Spinner } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { useFieldOTP } from "../../elements/CodeControl.js";
import { Form } from "../../elements/Form.js";
import { FormButtonContainer, FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { VerifiedDomainForm } from "./VerifiedDomainForm.js";
import React, { useRef } from "react";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/VerifyDomainForm.tsx
const VerifyDomainForm = withCardStateProvider((props) => {
	const { domainId: id, onSuccess, onReset, skipToVerified } = props;
	const card = useCardState();
	const { organizationSettings } = useEnvironment();
	const { organization } = useOrganization();
	const { data: domain, isLoading: domainIsLoading } = useFetch(!skipToVerified ? organization?.getDomain : void 0, { domainId: id });
	const title = localizationKeys("organizationProfile.verifyDomainPage.title");
	const subtitle = localizationKeys("organizationProfile.verifyDomainPage.subtitle", { domainName: domain?.name ?? "" });
	const wizard = useWizard({
		defaultStep: skipToVerified ? 2 : 0,
		onNextStep: () => card.setError(void 0)
	});
	const emailField = useFormControl("affiliationEmailAddress", "", {
		type: "text",
		label: localizationKeys("formFieldLabel__organizationDomainEmailAddress"),
		placeholder: localizationKeys("formFieldInputPlaceholder__organizationDomainEmailAddress"),
		infoText: localizationKeys("formFieldLabel__organizationDomainEmailAddressDescription"),
		isRequired: true
	});
	const affiliationEmailAddressRef = useRef();
	const subtitleVerificationCodeScreen = localizationKeys("organizationProfile.verifyDomainPage.subtitleVerificationCodeScreen", { emailAddress: affiliationEmailAddressRef.current || "" });
	const action = (code, resolve, reject) => {
		domain?.attemptAffiliationVerification?.({ code }).then(async (res) => {
			await resolve();
			if (res.verification?.status === "verified") wizard.nextStep();
			else onSuccess?.();
		}).catch((err) => reject(err));
	};
	const otp = useFieldOTP({
		onCodeEntryFinished: (code, resolve, reject) => {
			action(code, resolve, reject);
		},
		onResendCodeClicked: () => {
			domain?.prepareAffiliationVerification({ affiliationEmailAddress: emailField.value }).catch((err) => {
				handleError(err, [emailField], card.setError);
			});
		}
	});
	if (!organization || !organizationSettings) return null;
	const canSubmit = organization.name !== emailField.value;
	const emailDomainSuffix = `@${domain?.name}`;
	const onSubmitPrepare = (e) => {
		e.preventDefault();
		if (!domain) return;
		affiliationEmailAddressRef.current = `${emailField.value}${emailDomainSuffix}`;
		return domain.prepareAffiliationVerification({ affiliationEmailAddress: affiliationEmailAddressRef.current }).then(wizard.nextStep).catch((err) => {
			handleError(err, [emailField], card.setError);
		});
	};
	if ((domainIsLoading || !domain) && !skipToVerified) return /* @__PURE__ */ jsx(Flex, {
		direction: "row",
		align: "center",
		justify: "center",
		children: /* @__PURE__ */ jsx(Spinner, {
			size: "lg",
			colorScheme: "primary",
			elementDescriptor: descriptors.spinner
		})
	});
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [
			/* @__PURE__ */ jsx(FormContainer, {
				headerTitle: title,
				headerSubtitle: subtitle,
				children: /* @__PURE__ */ jsxs(Form.Root, {
					onSubmit: onSubmitPrepare,
					children: [/* @__PURE__ */ jsx(Form.ControlRow, {
						elementId: emailField.id,
						children: /* @__PURE__ */ jsx(Form.InputGroup, {
							...emailField.props,
							autoFocus: true,
							groupSuffix: emailDomainSuffix,
							ignorePasswordManager: true
						})
					}), /* @__PURE__ */ jsx(FormButtons, {
						isDisabled: !canSubmit,
						onReset
					})]
				})
			}),
			/* @__PURE__ */ jsxs(FormContainer, {
				headerTitle: title,
				headerSubtitle: subtitleVerificationCodeScreen,
				children: [/* @__PURE__ */ jsx(Form.OTPInput, {
					...otp,
					label: localizationKeys("organizationProfile.verifyDomainPage.formTitle"),
					description: localizationKeys("organizationProfile.verifyDomainPage.formSubtitle"),
					resendButton: localizationKeys("organizationProfile.verifyDomainPage.resendButton")
				}), /* @__PURE__ */ jsx(FormButtonContainer, { children: /* @__PURE__ */ jsx(Button, {
					elementDescriptor: descriptors.formButtonReset,
					block: false,
					variant: "ghost",
					textVariant: "buttonSmall",
					type: "reset",
					isDisabled: otp.isLoading || otp.otpControl.otpInputProps.feedbackType === "success",
					onClick: () => {
						otp.otpControl.otpInputProps.clearFeedback();
						otp.otpControl.reset();
						wizard.prevStep();
					},
					localizationKey: localizationKeys("userProfile.formButtonReset")
				}) })]
			}),
			/* @__PURE__ */ jsx(VerifiedDomainForm, {
				domainId: id,
				mode: "select",
				onSuccess,
				onReset
			})
		]
	});
});

//#endregion
export { VerifyDomainForm };
//# sourceMappingURL=VerifyDomainForm.js.map