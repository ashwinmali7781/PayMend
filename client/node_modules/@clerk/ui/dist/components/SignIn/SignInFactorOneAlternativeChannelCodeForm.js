import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSignInContext } from "../../contexts/components/SignIn.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { useCardState } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { VerificationCodeCard } from "../../elements/VerificationCodeCard.js";
import { useSupportEmail } from "../../hooks/useSupportEmail.js";
import { navigateOnSignInProtectGate } from "./handleProtectCheck.js";
import { isUserLockedError } from "@clerk/shared/error";
import { clerkInvalidFAPIResponse } from "@clerk/shared/internal/clerk-js/errors";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorOneAlternativeChannelCodeForm.tsx
const SignInFactorOneAlternativeChannelCodeForm = (props) => {
	const signIn = useCoreSignIn();
	const card = useCardState();
	const { navigate } = useRouter();
	const { afterSignInUrl, navigateOnSetActive } = useSignInContext();
	const { setActive } = useClerk();
	const supportEmail = useSupportEmail();
	const clerk = useClerk();
	const channel = props.factor.channel;
	const shouldAvoidPrepare = signIn.firstFactorVerification.status === "verified" && props.factorAlreadyPrepared;
	const goBack = () => {
		return navigate("../");
	};
	const prepare = () => {
		if (shouldAvoidPrepare) return;
		signIn.prepareFirstFactor({
			...props.factor,
			channel
		}).then(() => props.onFactorPrepare()).catch((err) => handleError(err, [], card.setError));
	};
	const action = (code, resolve, reject) => {
		signIn.attemptFirstFactor({
			strategy: props.factor.strategy,
			code
		}).then(async (res) => {
			await resolve();
			if (navigateOnSignInProtectGate(res, navigate, "../protect-check")) return;
			switch (res.status) {
				case "complete": return setActive({
					session: res.createdSessionId,
					navigate: async ({ session, decorateUrl }) => {
						await navigateOnSetActive({
							session,
							redirectUrl: afterSignInUrl,
							decorateUrl
						});
					}
				});
				case "needs_second_factor": return navigate("../factor-two");
				case "needs_new_password": return navigate("../reset-password");
				default: return console.error(clerkInvalidFAPIResponse(res.status, supportEmail));
			}
		}).catch((err) => {
			if (isUserLockedError(err)) return clerk.__internal_navigateWithError("..", err.errors[0]);
			return reject(err);
		});
	};
	const prepareWithSMS = () => {
		card.setError(void 0);
		props.onChangePhoneCodeChannel({
			...props.factor,
			channel: void 0
		});
	};
	return /* @__PURE__ */ jsx(VerificationCodeCard, {
		cardTitle: props.cardTitle,
		cardSubtitle: props.cardSubtitle,
		inputLabel: props.inputLabel,
		resendButton: props.resendButton,
		onCodeEntryFinishedAction: action,
		onResendCodeClicked: prepare,
		safeIdentifier: props.factor.safeIdentifier,
		profileImageUrl: signIn.userData.imageUrl,
		identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__phoneNumber"),
		alternativeMethodsLabel: localizationKeys("footerActionLink__alternativePhoneCodeProvider"),
		onShowAlternativeMethodsClicked: prepareWithSMS,
		showAlternativeMethods: true,
		onIdentityPreviewEditClicked: goBack,
		onBackLinkClicked: props.onBackLinkClicked
	});
};

//#endregion
export { SignInFactorOneAlternativeChannelCodeForm };
//# sourceMappingURL=SignInFactorOneAlternativeChannelCodeForm.js.map