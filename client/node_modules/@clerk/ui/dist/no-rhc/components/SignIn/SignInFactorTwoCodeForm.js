import { useRouter } from "../../router/RouteContext.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSignInContext } from "../../contexts/components/SignIn.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { VerificationCodeCard } from "../../elements/VerificationCodeCard.js";
import { useSupportEmail } from "../../hooks/useSupportEmail.js";
import { navigateOnSignInProtectGate } from "./handleProtectCheck.js";
import { isResetPasswordStrategy } from "./utils.js";
import { isUserLockedError } from "@clerk/shared/error";
import { clerkInvalidFAPIResponse } from "@clerk/shared/internal/clerk-js/errors";
import React, { useMemo } from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorTwoCodeForm.tsx
const isResettingPassword = (resource) => isResetPasswordStrategy(resource.firstFactorVerification?.strategy) && resource.firstFactorVerification?.status === "verified";
const SignInFactorTwoCodeForm = (props) => {
	const env = useEnvironment();
	const signIn = useCoreSignIn();
	const card = useCardState();
	const { afterSignInUrl, navigateOnSetActive } = useSignInContext();
	const { setActive } = useClerk();
	const { navigate } = useRouter();
	const supportEmail = useSupportEmail();
	const clerk = useClerk();
	const signInAsDifferentUser = () => navigate("../");
	const showNewDeviceVerificationNotice = useMemo(() => {
		const anyAttributeUsedForSecondFactor = Object.values(env.userSettings.attributes).some((attr) => attr.used_for_second_factor);
		return signIn.clientTrustState === "new" && !anyAttributeUsedForSecondFactor;
	}, [signIn.clientTrustState, env.userSettings.attributes]);
	React.useEffect(() => {
		if (props.factorAlreadyPrepared) return;
		prepare?.();
	}, []);
	const prepare = props.prepare ? () => {
		return props.prepare?.().then(() => props.onFactorPrepare()).catch((err) => {
			if (isUserLockedError(err)) return clerk.__internal_navigateWithError("..", err.errors[0]);
			handleError(err, [], card.setError);
		});
	} : void 0;
	const action = (code, resolve, reject) => {
		signIn.attemptSecondFactor({
			strategy: props.factor.strategy,
			code
		}).then(async (res) => {
			await resolve();
			if (navigateOnSignInProtectGate(res, navigate, "../protect-check")) return;
			switch (res.status) {
				case "complete":
					if (isResettingPassword(res) && res.createdSessionId) {
						const queryParams = new URLSearchParams();
						queryParams.set("createdSessionId", res.createdSessionId);
						return navigate(`../reset-password-success?${queryParams.toString()}`);
					}
					return setActive({
						session: res.createdSessionId,
						navigate: async ({ session, decorateUrl }) => {
							await navigateOnSetActive({
								session,
								redirectUrl: afterSignInUrl,
								decorateUrl
							});
						}
					});
				default: return console.error(clerkInvalidFAPIResponse(res.status, supportEmail));
			}
		}).catch((err) => {
			if (isUserLockedError(err)) return clerk.__internal_navigateWithError("..", err.errors[0]);
			return reject(err);
		});
	};
	return /* @__PURE__ */ jsx(VerificationCodeCard, {
		cardTitle: props.cardTitle,
		cardSubtitle: isResettingPassword(signIn) ? localizationKeys("signIn.forgotPassword.subtitle") : props.cardSubtitle,
		cardNotice: props.showClientTrustNotice || showNewDeviceVerificationNotice ? localizationKeys("signIn.newDeviceVerificationNotice") : void 0,
		resendButton: props.resendButton,
		inputLabel: props.inputLabel,
		onCodeEntryFinishedAction: action,
		onResendCodeClicked: prepare,
		safeIdentifier: "safeIdentifier" in props.factor ? props.factor.safeIdentifier : void 0,
		profileImageUrl: signIn.userData.imageUrl,
		identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__identifier"),
		onShowAlternativeMethodsClicked: props.onShowAlternativeMethodsClicked,
		onDifferentAccountClicked: signInAsDifferentUser,
		children: isResettingPassword(signIn) && /* @__PURE__ */ jsx(Text, {
			localizationKey: localizationKeys("signIn.resetPasswordMfa.detailsLabel"),
			colorScheme: "secondary"
		})
	});
};

//#endregion
export { SignInFactorTwoCodeForm };
//# sourceMappingURL=SignInFactorTwoCodeForm.js.map