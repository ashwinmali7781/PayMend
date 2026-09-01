import { useRouter } from "../../router/RouteContext.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { SignInContext } from "../../contexts/components/SignIn.js";
import { useSignUpContext } from "../../contexts/components/SignUp.js";
import { useCoreSignUp } from "../../contexts/CoreClientContext.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { buildRequest, useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Flex } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { LoadingCard } from "../../elements/LoadingCard.js";
import { SocialButtonsReversibleContainerWithDivider } from "../../elements/ReversibleContainer.js";
import { createUsernameError } from "../../utils/usernameUtils.js";
import { SignUpForm } from "./SignUpForm.js";
import { determineActiveFields, emailOrPhone, getInitialActiveIdentifier, minimizeFieldsForExistingSignup } from "./signUpFormHelpers.js";
import { SignUpSocialButtons } from "./SignUpSocialButtons.js";
import { useCompleteSignUpFlow } from "./useCompleteSignUpFlow.js";
import React, { useEffect, useMemo } from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignUp/SignUpContinue.tsx
function SignUpContinueInternal() {
	const card = useCardState();
	const clerk = useClerk();
	const { navigate } = useRouter();
	const { displayConfig, userSettings } = useEnvironment();
	const { attributes, usernameSettings } = userSettings;
	const { t, locale } = useLocalizations();
	const { signInUrl, unsafeMetadata, initialValues = {}, isCombinedFlow: _isCombinedFlow } = useSignUpContext();
	const signUp = useCoreSignUp();
	const isWithinSignInContext = !!React.useContext(SignInContext);
	const isCombinedFlow = !!(_isCombinedFlow && !!isWithinSignInContext);
	const isProgressiveSignUp = userSettings.signUp.progressive;
	const [activeCommIdentifierType, setActiveCommIdentifierType] = React.useState(getInitialActiveIdentifier(attributes, userSettings.signUp.progressive));
	const completeSignUpFlow = useCompleteSignUpFlow();
	const formState = {
		firstName: useFormControl("firstName", initialValues.firstName || "", {
			type: "text",
			label: localizationKeys("formFieldLabel__firstName"),
			placeholder: localizationKeys("formFieldInputPlaceholder__firstName")
		}),
		lastName: useFormControl("lastName", initialValues.lastName || "", {
			type: "text",
			label: localizationKeys("formFieldLabel__lastName"),
			placeholder: localizationKeys("formFieldInputPlaceholder__lastName")
		}),
		emailAddress: useFormControl("emailAddress", initialValues.emailAddress || signUp.emailAddress || "", {
			type: "email",
			label: localizationKeys("formFieldLabel__emailAddress"),
			placeholder: localizationKeys("formFieldInputPlaceholder__emailAddress")
		}),
		username: useFormControl("username", initialValues.username || "", {
			type: "text",
			label: localizationKeys("formFieldLabel__username"),
			placeholder: localizationKeys("formFieldInputPlaceholder__username"),
			transformer: (value) => value.trim(),
			buildErrorMessage: (errors) => createUsernameError(errors, {
				t,
				locale,
				usernameSettings
			})
		}),
		phoneNumber: useFormControl("phoneNumber", initialValues.phoneNumber || "", {
			type: "tel",
			label: localizationKeys("formFieldLabel__phoneNumber"),
			placeholder: localizationKeys("formFieldInputPlaceholder__phoneNumber")
		}),
		password: useFormControl("password", "", {
			type: "password",
			label: localizationKeys("formFieldLabel__password"),
			placeholder: localizationKeys("formFieldInputPlaceholder__signUpPassword"),
			validatePassword: true
		}),
		legalAccepted: useFormControl("legalAccepted", "", {
			type: "checkbox",
			label: "",
			defaultChecked: false,
			isRequired: userSettings.signUp.legal_consent_enabled || false
		})
	};
	const onlyLegalConsentMissing = useMemo(() => signUp.missingFields && signUp.missingFields.length === 1 && signUp.missingFields[0] === "legal_accepted" && signUp.unverifiedFields && signUp.unverifiedFields.length === 0, [signUp.missingFields, signUp.unverifiedFields]);
	useEffect(() => {
		if (!signUp.id && clerk.__internal_setActiveInProgress !== true) navigate(displayConfig.signUpUrl);
	}, []);
	if (!signUp.id) return /* @__PURE__ */ jsx(LoadingCard, {});
	const hasEmail = !!formState.emailAddress.value;
	const hasVerifiedExternalAccount = signUp.verifications?.externalAccount?.status == "verified";
	const fields = determineActiveFields({
		attributes,
		hasEmail,
		activeCommIdentifierType,
		signUp,
		isProgressiveSignUp,
		legalConsentRequired: userSettings.signUp.legal_consent_enabled
	});
	minimizeFieldsForExistingSignup(fields, signUp);
	const oauthOptions = userSettings.authenticatableSocialStrategies;
	const handleChangeActive = (type) => {
		if (!emailOrPhone(attributes, isProgressiveSignUp)) return;
		setActiveCommIdentifierType(type);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const fieldsToSubmit = Object.entries(fields).reduce((acc, [k, v]) => [...acc, ...v && formState[k] ? [formState[k]] : []], []);
		if (unsafeMetadata) fieldsToSubmit.push({
			id: "unsafeMetadata",
			value: unsafeMetadata
		});
		const emailAddressProvided = !!(fieldsToSubmit.find((f) => f.id === "emailAddress")?.value || "");
		const phoneNumberProvided = !!(fieldsToSubmit.find((f) => f.id === "phoneNumber")?.value || "");
		if (signUp.missingFields.includes("email_address") && signUp.missingFields.includes("phone_number") && !emailAddressProvided && !phoneNumberProvided && emailOrPhone(attributes, isProgressiveSignUp)) {
			fieldsToSubmit.push(formState.emailAddress);
			fieldsToSubmit.push(formState.phoneNumber);
		}
		card.setLoading();
		card.setError(void 0);
		return signUp.update(buildRequest(fieldsToSubmit)).then((res) => completeSignUpFlow({
			signUp: res,
			verifyEmailPath: "./verify-email-address",
			verifyPhonePath: "./verify-phone-number",
			protectCheckPath: "../protect-check"
		})).catch((err) => handleError(err, fieldsToSubmit, card.setError)).finally(() => card.setIdle());
	};
	const canToggleEmailPhone = emailOrPhone(attributes, isProgressiveSignUp);
	const showOauthProviders = !hasVerifiedExternalAccount && oauthOptions.length > 0;
	const headerTitle = !onlyLegalConsentMissing ? localizationKeys("signUp.continue.title") : localizationKeys("signUp.legalConsent.continue.title");
	const headerSubtitle = !onlyLegalConsentMissing ? localizationKeys("signUp.continue.subtitle") : localizationKeys("signUp.legalConsent.continue.subtitle");
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "complete",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: headerTitle }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: headerSubtitle })]
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsx(Flex, {
				direction: "col",
				elementDescriptor: descriptors.main,
				gap: 8,
				children: /* @__PURE__ */ jsxs(SocialButtonsReversibleContainerWithDivider, { children: [showOauthProviders && !onlyLegalConsentMissing && /* @__PURE__ */ jsx(SignUpSocialButtons, {
					enableOAuthProviders: showOauthProviders,
					enableWeb3Providers: false,
					enableAlternativePhoneCodeProviders: false,
					continueSignUp: true
				}), /* @__PURE__ */ jsx(SignUpForm, {
					handleSubmit,
					fields,
					formState,
					onlyLegalAcceptedMissing: onlyLegalConsentMissing,
					canToggleEmailPhone,
					handleEmailPhoneToggle: handleChangeActive
				})] })
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, { children: !isCombinedFlow ? /* @__PURE__ */ jsxs(Card.Action, {
			elementId: "signUp",
			children: [/* @__PURE__ */ jsx(Card.ActionText, { localizationKey: localizationKeys("signUp.continue.actionText") }), /* @__PURE__ */ jsx(Card.ActionLink, {
				localizationKey: localizationKeys("signUp.continue.actionLink"),
				to: isCombinedFlow ? "../../" : clerk.buildUrlWithAuth(signInUrl)
			})]
		}) : null })] })
	});
}
const SignUpContinue = withCardStateProvider(SignUpContinueInternal);

//#endregion
export { SignUpContinue };
//# sourceMappingURL=SignUpContinue.js.map