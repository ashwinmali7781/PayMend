import { useRouter } from "../../router/RouteContext.js";
import { useSignUpContext } from "../../contexts/components/SignUp.js";
import { useCoreSignUp } from "../../contexts/CoreClientContext.js";
import { useCardState } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { web3CallbackErrorHandler } from "../../utils/web3CallbackErrorHandler.js";
import { buildSignUpOAuthTransportCallbackParams } from "../SignIn/buildOAuthCallbackParams.js";
import { originPrefersPopup } from "../../utils/originPrefersPopup.js";
import { SocialButtons } from "../../elements/SocialButtons.js";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignUp/SignUpSocialButtons.tsx
const SignUpSocialButtons = React.memo((props) => {
	const clerk = useClerk();
	const { navigate } = useRouter();
	const card = useCardState();
	const ctx = useSignUpContext();
	const signUp = useCoreSignUp();
	const redirectUrl = ctx.ssoCallbackUrl;
	const redirectUrlComplete = ctx.afterSignUpUrl || "/";
	const shouldUsePopup = !clerk.__internal_hasOAuthTransport && (ctx.oauthFlow === "popup" || ctx.oauthFlow === "auto" && originPrefersPopup());
	const { continueSignUp = false, onAlternativePhoneCodeProviderClick, ...rest } = props;
	return /* @__PURE__ */ jsx(SocialButtons, {
		...rest,
		showLastAuthenticationStrategy: false,
		idleAfterDelay: !shouldUsePopup && !clerk.__internal_hasOAuthTransport,
		oauthCallback: (strategy) => {
			if (shouldUsePopup) {
				const popup = window.open("about:blank", "", "width=600,height=800");
				const interval = setInterval(() => {
					if (!popup || popup.closed) {
						clearInterval(interval);
						card.setIdle();
					}
				}, 500);
				return signUp.authenticateWithPopup({
					strategy,
					redirectUrl,
					redirectUrlComplete,
					popup,
					continueSignUp,
					unsafeMetadata: ctx.unsafeMetadata,
					legalAccepted: props.legalAccepted,
					oidcPrompt: ctx.oidcPrompt
				}).catch((err) => handleError(err, [], card.setError));
			}
			return signUp.authenticateWithRedirect({
				continueSignUp,
				redirectUrl,
				redirectUrlComplete,
				strategy,
				unsafeMetadata: ctx.unsafeMetadata,
				legalAccepted: props.legalAccepted,
				oidcPrompt: ctx.oidcPrompt,
				__internal_callbackParams: {
					...buildSignUpOAuthTransportCallbackParams(ctx),
					__internal_navigateOnSetActive: ctx.navigateOnSetActive,
					__internal_navigate: navigate
				}
			}).catch((err) => {
				handleError(err, [], card.setError);
				if (clerk.__internal_hasOAuthTransport) card.setIdle();
			});
		},
		web3Callback: (strategy) => {
			if (strategy === "web3_solana_signature") return navigate(`choose-wallet?strategy=${strategy}`);
			return clerk.authenticateWithWeb3({
				customNavigate: navigate,
				redirectUrl: redirectUrlComplete,
				signUpContinueUrl: "continue",
				unsafeMetadata: ctx.unsafeMetadata,
				strategy,
				legalAccepted: props.legalAccepted
			}).catch((err) => web3CallbackErrorHandler(err, card.setError));
		},
		alternativePhoneCodeCallback: (channel) => {
			onAlternativePhoneCodeProviderClick?.(channel);
		}
	});
});

//#endregion
export { SignUpSocialButtons };
//# sourceMappingURL=SignUpSocialButtons.js.map