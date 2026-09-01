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
import { isUserLockedError } from "@clerk/shared/error";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorTwoEmailLinkCard.tsx
const isNewDevice = (resource) => resource.clientTrustState === "new";
const SignInFactorTwoEmailLinkCard = (props) => {
	const { t } = useLocalizations();
	const card = useCardState();
	const signIn = useCoreSignIn();
	const signInContext = useSignInContext();
	const { signInUrl } = signInContext;
	const { afterSignInUrl } = useSignInContext();
	const { navigate } = useRouter();
	const { setActive } = useClerk();
	const { startEmailLinkFlow, cancelEmailLinkFlow } = useEmailLink(signIn);
	const [showVerifyModal, setShowVerifyModal] = React.useState(false);
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
		const ver = si.secondFactorVerification;
		if (ver.status === "expired") card.setError(t(localizationKeys("formFieldError__verificationLinkExpired")));
		else if (navigateOnSignInProtectGate(si, navigate, "../protect-check")) return;
		else if (ver.verifiedFromTheSameClient()) setShowVerifyModal(true);
		else await setActive({
			session: si.createdSessionId,
			redirectUrl: afterSignInUrl
		});
	};
	if (showVerifyModal) return /* @__PURE__ */ jsx(EmailLinkStatusCard, {
		title: localizationKeys("signIn.emailLink.verifiedSwitchTab.titleNewTab"),
		subtitle: localizationKeys("signIn.emailLink.verifiedSwitchTab.subtitleNewTab"),
		status: "verified_switch_tab"
	});
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "emailLink",
		children: /* @__PURE__ */ jsx(VerificationLinkCard, {
			cardTitle: localizationKeys("signIn.emailLinkMfa.title"),
			cardSubtitle: localizationKeys("signIn.emailLinkMfa.subtitle"),
			cardNotice: props.showClientTrustNotice || isNewDevice(signIn) ? localizationKeys("signIn.newDeviceVerificationNotice") : void 0,
			formSubtitle: localizationKeys("signIn.emailLinkMfa.formSubtitle"),
			resendButton: localizationKeys("signIn.emailLinkMfa.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__emailAddress"),
			onResendCodeClicked: restartVerification,
			safeIdentifier: props.factor.safeIdentifier,
			profileImageUrl: signIn.userData.imageUrl,
			onShowAlternativeMethodsClicked: props.onShowAlternativeMethodsClicked
		})
	});
};

//#endregion
export { SignInFactorTwoEmailLinkCard };
//# sourceMappingURL=SignInFactorTwoEmailLinkCard.js.map