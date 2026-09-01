import { useRouter } from "../../router/RouteContext.js";
import { useEmailLink } from "../../hooks/useEmailLink.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { buildVerificationRedirectUrl } from "../../common/redirects.js";
import { useSignInContext } from "../../contexts/components/SignIn.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { EmailLinkStatusCard } from "../../common/EmailLinkStatusCard.js";
import { handleError } from "../../utils/errorHandler.js";
import { VerificationLinkCard } from "../../elements/VerificationLinkCard.js";
import { navigateOnSignInProtectGate } from "./handleProtectCheck.js";
import { handleSignUpIfMissingTransfer } from "./handleSignUpIfMissingTransfer.js";
import { isUserLockedError } from "@clerk/shared/error";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorOneEmailLinkCard.tsx
const SignInFactorOneEmailLinkCard = (props) => {
	const { t } = useLocalizations();
	const card = useCardState();
	const signIn = useCoreSignIn();
	const signInContext = useSignInContext();
	const { signInUrl, afterSignInUrl, afterSignUpUrl, signUpIfMissingEnabled, navigateOnSetActive } = signInContext;
	const { navigate } = useRouter();
	const { setActive } = useClerk();
	const { startEmailLinkFlow, cancelEmailLinkFlow } = useEmailLink(signIn);
	const [switchTabStatus, setSwitchTabStatus] = React.useState(null);
	const clerk = useClerk();
	React.useEffect(() => {
		startEmailLinkVerification();
	}, []);
	const restartVerification = () => {
		cancelEmailLinkFlow();
		startEmailLinkVerification();
	};
	const startEmailLinkVerification = () => {
		startEmailLinkFlow({
			emailAddressId: props.factor.emailAddressId,
			redirectUrl: buildVerificationRedirectUrl({
				ctx: signInContext,
				baseUrl: signInUrl,
				intent: "sign-in"
			})
		}).then((res) => handleVerificationResult(res)).catch((err) => {
			if (isUserLockedError(err)) return clerk.__internal_navigateWithError("..", err.errors[0]);
			handleError(err, [], card.setError);
		});
	};
	const handleVerificationResult = async (si) => {
		const ver = si.firstFactorVerification;
		if (ver.status === "expired") card.setError(t(localizationKeys("formFieldError__verificationLinkExpired")));
		else if (signUpIfMissingEnabled && ver.status === "transferable") return handleSignUpIfMissingTransfer({
			clerk,
			navigate,
			afterSignUpUrl,
			navigateOnSetActive,
			unsafeMetadata: signInContext.unsafeMetadata
		});
		else if (ver.verifiedFromTheSameClient()) setSwitchTabStatus("verified_switch_tab");
		else await completeSignInFlow(si);
	};
	const completeSignInFlow = async (si) => {
		if (navigateOnSignInProtectGate(si, navigate, "../protect-check")) return;
		if (si.status === "complete") return setActive({
			session: si.createdSessionId,
			redirectUrl: afterSignInUrl
		});
		else if (si.status === "needs_second_factor") return navigate("../factor-two");
	};
	if (switchTabStatus) return /* @__PURE__ */ jsx(EmailLinkStatusCard, {
		title: switchTabStatus === "transferable" ? localizationKeys("signIn.emailLink.verifiedTransferable.title") : localizationKeys("signIn.emailLink.verifiedSwitchTab.titleNewTab"),
		subtitle: localizationKeys("signIn.emailLink.verifiedSwitchTab.subtitleNewTab"),
		status: switchTabStatus
	});
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "emailLink",
		children: /* @__PURE__ */ jsx(VerificationLinkCard, {
			cardTitle: localizationKeys("signIn.emailLink.title"),
			cardSubtitle: localizationKeys("signIn.emailLink.subtitle"),
			formTitle: localizationKeys("signIn.emailLink.formTitle"),
			formSubtitle: localizationKeys("signIn.emailLink.formSubtitle"),
			resendButton: localizationKeys("signIn.emailLink.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__emailAddress"),
			onResendCodeClicked: restartVerification,
			safeIdentifier: props.factor.safeIdentifier,
			profileImageUrl: signIn.userData.imageUrl,
			onShowAlternativeMethodsClicked: props.onShowAlternativeMethodsClicked
		})
	});
};

//#endregion
export { SignInFactorOneEmailLinkCard };
//# sourceMappingURL=SignInFactorOneEmailLinkCard.js.map