import { useRouter } from "../../router/RouteContext.js";
import { useSignInContext } from "../../contexts/components/SignIn.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { useCardState } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { web3CallbackErrorHandler } from "../../utils/web3CallbackErrorHandler.js";
import { buildSignInOAuthTransportCallbackParams } from "./buildOAuthCallbackParams.js";
import { originPrefersPopup } from "../../utils/originPrefersPopup.js";
import { SocialButtons } from "../../elements/SocialButtons.js";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import React from "react";
import { ERROR_CODES } from "@clerk/shared/internal/clerk-js/constants";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInSocialButtons.tsx
const SignInSocialButtons = React.memo((props) => {
	const clerk = useClerk();
	const { navigate } = useRouter();
	const card = useCardState();
	const ctx = useSignInContext();
	const signIn = useCoreSignIn();
	const redirectUrl = ctx.ssoCallbackUrl;
	const redirectUrlComplete = ctx.afterSignInUrl || "/";
	const shouldUsePopup = !clerk.__internal_hasOAuthTransport && (ctx.oauthFlow === "popup" || ctx.oauthFlow === "auto" && originPrefersPopup());
	const { onAlternativePhoneCodeProviderClick, ...rest } = props;
	const handleError$1 = (err) => {
		if (isClerkAPIResponseError(err)) {
			if (err.errors.find((e) => e.code === ERROR_CODES.SESSION_EXISTS)) return clerk.setActive({
				session: clerk.client.lastActiveSessionId,
				navigate: async ({ session, decorateUrl }) => {
					await ctx.navigateOnSetActive({
						session,
						redirectUrl: ctx.afterSignInUrl,
						decorateUrl
					});
				}
			});
		}
		return handleError(err, [], card.setError);
	};
	return /* @__PURE__ */ jsx(SocialButtons, {
		...rest,
		showLastAuthenticationStrategy: true,
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
				return signIn.authenticateWithPopup({
					strategy,
					redirectUrl,
					redirectUrlComplete,
					popup,
					oidcPrompt: ctx.oidcPrompt
				}).catch((err) => handleError$1(err));
			}
			return signIn.authenticateWithRedirect({
				strategy,
				redirectUrl,
				redirectUrlComplete,
				oidcPrompt: ctx.oidcPrompt,
				__internal_callbackParams: {
					...buildSignInOAuthTransportCallbackParams(ctx),
					__internal_navigateOnSetActive: ctx.navigateOnSetActive,
					__internal_navigate: navigate
				}
			}).catch((err) => {
				const res = handleError$1(err);
				if (clerk.__internal_hasOAuthTransport) card.setIdle();
				return res;
			});
		},
		web3Callback: (strategy) => {
			if (strategy === "web3_solana_signature") return navigate(`choose-wallet?strategy=${strategy}`);
			return clerk.authenticateWithWeb3({
				customNavigate: navigate,
				redirectUrl: redirectUrlComplete,
				signUpContinueUrl: ctx.isCombinedFlow ? "create/continue" : ctx.signUpContinueUrl,
				strategy,
				secondFactorUrl: "factor-two",
				protectCheckUrl: "protect-check",
				signUpProtectCheckUrl: ctx.isCombinedFlow ? "create/protect-check" : void 0
			}).catch((err) => web3CallbackErrorHandler(err, card.setError));
		},
		alternativePhoneCodeCallback: (channel) => {
			onAlternativePhoneCodeProviderClick?.(channel);
		}
	});
});

//#endregion
export { SignInSocialButtons };
//# sourceMappingURL=SignInSocialButtons.js.map