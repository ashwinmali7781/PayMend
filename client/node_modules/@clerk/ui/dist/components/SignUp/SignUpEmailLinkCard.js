import { useEmailLink } from "../../hooks/useEmailLink.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSignUpContext } from "../../contexts/components/SignUp.js";
import { useCoreSignUp } from "../../contexts/CoreClientContext.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { Flow } from "../../customizables/Flow.js";
import { useCardState } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { EmailLinkStatusCard } from "../../common/EmailLinkStatusCard.js";
import { VerificationLinkCard } from "../../elements/VerificationLinkCard.js";
import { useCompleteSignUpFlow } from "./useCompleteSignUpFlow.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignUp/SignUpEmailLinkCard.tsx
const SignUpEmailLinkCard = () => {
	const { t } = useLocalizations();
	const signUp = useCoreSignUp();
	const signUpContext = useSignUpContext();
	const card = useCardState();
	const completeSignUpFlow = useCompleteSignUpFlow();
	const [showVerifyModal, setShowVerifyModal] = React.useState(false);
	const { startEmailLinkFlow, cancelEmailLinkFlow } = useEmailLink(signUp);
	React.useEffect(() => {
		startEmailLinkVerification();
	}, []);
	const restartVerification = () => {
		cancelEmailLinkFlow();
		startEmailLinkVerification();
	};
	const startEmailLinkVerification = () => {
		return startEmailLinkFlow({ redirectUrl: signUpContext.emailLinkRedirectUrl }).then((res) => handleVerificationResult(res)).catch((err) => {
			handleError(err, [], card.setError);
		});
	};
	const handleVerificationResult = async (su) => {
		const ver = su.verifications.emailAddress;
		if (ver.status === "expired") card.setError(t(localizationKeys("formFieldError__verificationLinkExpired")));
		else if (ver.verifiedFromTheSameClient()) setShowVerifyModal(true);
		else await completeSignUpFlow({
			signUp: su,
			continuePath: "../continue",
			verifyEmailPath: "../verify-email-address",
			verifyPhonePath: "../verify-phone-number",
			protectCheckPath: "../protect-check"
		});
	};
	if (showVerifyModal) return /* @__PURE__ */ jsx(EmailLinkStatusCard, {
		title: localizationKeys("signUp.emailLink.verifiedSwitchTab.title"),
		subtitle: localizationKeys("signUp.emailLink.verifiedSwitchTab.subtitleNewTab"),
		status: "verified_switch_tab"
	});
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "emailLink",
		children: /* @__PURE__ */ jsx(VerificationLinkCard, {
			cardTitle: localizationKeys("signUp.emailLink.title"),
			cardSubtitle: localizationKeys("signUp.emailLink.subtitle"),
			formTitle: localizationKeys("signUp.emailLink.formTitle"),
			formSubtitle: localizationKeys("signUp.emailLink.formSubtitle"),
			resendButton: localizationKeys("signUp.emailLink.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__emailAddress"),
			onResendCodeClicked: restartVerification,
			safeIdentifier: signUp.emailAddress
		})
	});
};

//#endregion
export { SignUpEmailLinkCard };
//# sourceMappingURL=SignUpEmailLinkCard.js.map