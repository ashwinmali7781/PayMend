import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgEnvelope from "../../icons/envelope.js";
import SvgFingerprint from "../../icons/fingerprint.js";
import SvgLink from "../../icons/link.js";
import SvgLock from "../../icons/lock.js";
import SvgLockArrow from "../../icons/lock-arrow.js";
import SvgSpeechBubble from "../../icons/speech-bubble.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Button, Col, Flex } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Divider } from "../../elements/Divider.js";
import { Header } from "../../elements/Header.js";
import { ArrowBlockButton } from "../../elements/ArrowBlockButton.js";
import { formatSafeIdentifier } from "../../utils/formatSafeIdentifier.js";
import { BackLink } from "../../elements/BackLink.js";
import { useAlternativeStrategies } from "../../hooks/useAlternativeStrategies.js";
import { SignInSocialButtons } from "./SignInSocialButtons.js";
import { useResetPasswordFactor } from "./useResetPasswordFactor.js";
import { withHavingTrouble } from "./withHavingTrouble.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/AlternativeMethods.tsx
const AlternativeMethods = (props) => {
	return withHavingTrouble(AlternativeMethodsList, { ...props });
};
const AlternativeMethodsList = (props) => {
	const { onBackLinkClick, onHavingTroubleClick, onFactorSelected, mode = "default" } = props;
	const card = useCardState();
	const resetPasswordFactor = useResetPasswordFactor();
	const { supportedFirstFactors } = useCoreSignIn();
	const { firstPartyFactors, hasAnyStrategy } = useAlternativeStrategies({
		filterOutFactor: props?.currentFactor,
		supportedFirstFactors
	});
	const flowPart = determineFlowPart(mode);
	const cardTitleKey = determineTitle(mode);
	const isReset = determineIsReset(mode);
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: flowPart,
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: cardTitleKey }), !isReset && mode !== "passwordCompromised" && /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("signIn.alternativeMethods.subtitle") })]
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsxs(Flex, {
				direction: "col",
				elementDescriptor: descriptors.main,
				gap: 6,
				children: [
					isReset && resetPasswordFactor && /* @__PURE__ */ jsx(Button, {
						localizationKey: getButtonLabel(resetPasswordFactor),
						elementDescriptor: descriptors.alternativeMethodsBlockButton,
						isDisabled: card.isLoading,
						onClick: () => {
							card.setError(void 0);
							onFactorSelected(resetPasswordFactor);
						}
					}),
					isReset && hasAnyStrategy && /* @__PURE__ */ jsx(Divider, { dividerText: localizationKeys("signIn.forgotPasswordAlternativeMethods.label__alternativeMethods") }),
					/* @__PURE__ */ jsxs(Col, {
						gap: 4,
						children: [hasAnyStrategy && /* @__PURE__ */ jsxs(Flex, {
							elementDescriptor: descriptors.alternativeMethods,
							direction: "col",
							gap: 2,
							children: [/* @__PURE__ */ jsx(SignInSocialButtons, {
								enableWeb3Providers: true,
								enableOAuthProviders: true,
								enableAlternativePhoneCodeProviders: false
							}), firstPartyFactors && firstPartyFactors.map((factor, i) => /* @__PURE__ */ jsx(ArrowBlockButton, {
								leftIcon: getButtonIcon(factor),
								textLocalizationKey: getButtonLabel(factor),
								elementDescriptor: descriptors.alternativeMethodsBlockButton,
								textElementDescriptor: descriptors.alternativeMethodsBlockButtonText,
								arrowElementDescriptor: descriptors.alternativeMethodsBlockButtonArrow,
								textVariant: "buttonLarge",
								isDisabled: card.isLoading,
								onClick: () => {
									card.setError(void 0);
									onFactorSelected(factor);
								}
							}, i))]
						}), onBackLinkClick && /* @__PURE__ */ jsx(BackLink, {
							boxElementDescriptor: descriptors.backRow,
							linkElementDescriptor: descriptors.backLink,
							onClick: onBackLinkClick
						})]
					})
				]
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, { children: /* @__PURE__ */ jsxs(Card.Action, {
			elementId: "havingTrouble",
			children: [/* @__PURE__ */ jsx(Card.ActionText, { localizationKey: localizationKeys("signIn.alternativeMethods.actionText") }), /* @__PURE__ */ jsx(Card.ActionLink, {
				localizationKey: localizationKeys("signIn.alternativeMethods.actionLink"),
				onClick: onHavingTroubleClick
			})]
		}) })] })
	});
};
function getButtonLabel(factor) {
	switch (factor.strategy) {
		case "email_link": return localizationKeys("signIn.alternativeMethods.blockButton__emailLink", { identifier: formatSafeIdentifier(factor.safeIdentifier) || "" });
		case "email_code": return localizationKeys("signIn.alternativeMethods.blockButton__emailCode", { identifier: formatSafeIdentifier(factor.safeIdentifier) || "" });
		case "phone_code": return localizationKeys("signIn.alternativeMethods.blockButton__phoneCode", { identifier: formatSafeIdentifier(factor.safeIdentifier) || "" });
		case "password": return localizationKeys("signIn.alternativeMethods.blockButton__password");
		case "passkey": return localizationKeys("signIn.alternativeMethods.blockButton__passkey");
		case "reset_password_email_code": return localizationKeys("signIn.forgotPasswordAlternativeMethods.blockButton__resetPassword");
		case "reset_password_phone_code": return localizationKeys("signIn.forgotPasswordAlternativeMethods.blockButton__resetPassword");
		default: throw new Error(`Invalid sign in strategy: "${factor.strategy}"`);
	}
}
function getButtonIcon(factor) {
	return {
		email_link: SvgLink,
		email_code: SvgEnvelope,
		phone_code: SvgSpeechBubble,
		reset_password_email_code: SvgLockArrow,
		reset_password_phone_code: SvgLockArrow,
		password: SvgLock,
		passkey: SvgFingerprint
	}[factor.strategy];
}
function determineFlowPart(mode) {
	switch (mode) {
		case "forgot": return "forgotPasswordMethods";
		case "pwned": return "passwordPwnedMethods";
		case "passwordCompromised": return "passwordCompromisedMethods";
		default: return "alternativeMethods";
	}
}
function determineTitle(mode) {
	switch (mode) {
		case "forgot": return localizationKeys("signIn.forgotPasswordAlternativeMethods.title");
		case "pwned": return localizationKeys("signIn.passwordPwned.title");
		case "passwordCompromised": return localizationKeys("signIn.passwordCompromised.title");
		default: return localizationKeys("signIn.alternativeMethods.title");
	}
}
function determineIsReset(mode) {
	switch (mode) {
		case "forgot":
		case "pwned": return true;
		case "passwordCompromised": return false;
		default: return false;
	}
}

//#endregion
export { AlternativeMethods };
//# sourceMappingURL=AlternativeMethods.js.map