import { useRouter } from "../../router/RouteContext.js";
import { useSignInContext } from "../../contexts/components/SignIn.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { LoadingCard } from "../../elements/LoadingCard.js";
import { withRedirectToAfterSignIn, withRedirectToSignInTask } from "../../common/withRedirect.js";
import { SignInFactorTwoAlternativeMethods } from "./SignInFactorTwoAlternativeMethods.js";
import { SignInFactorTwoEmailCodeCard } from "./SignInFactorTwoEmailCodeCard.js";
import { SignInFactorTwoEmailLinkCard } from "./SignInFactorTwoEmailLinkCard.js";
import { SignInFactorTwoPhoneCodeCard } from "./SignInFactorTwoPhoneCodeCard.js";
import { useSecondFactorSelection } from "./useSecondFactorSelection.js";
import { SignInFactorTwoBackupCodeCard } from "./SignInFactorTwoBackupCodeCard.js";
import { SignInFactorTwoTOTPCard } from "./SignInFactorTwoTOTPCard.js";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorTwo.tsx
function SignInFactorTwoInternal() {
	const clerk = useClerk();
	const signIn = useCoreSignIn();
	const router = useRouter();
	const { afterSignInUrl } = useSignInContext();
	const { currentFactor, factorAlreadyPrepared, handleFactorPrepare, selectFactor, showAllStrategies, toggleAllStrategies } = useSecondFactorSelection(signIn.supportedSecondFactors);
	const onShowAlternativeMethodsClicked = signIn.supportedSecondFactors && signIn.supportedSecondFactors.length > 1 ? toggleAllStrategies : void 0;
	React.useEffect(() => {
		if (clerk.__internal_setActiveInProgress) return;
		if (signIn.status === null || signIn.status === "needs_identifier" || signIn.status === "needs_first_factor") if (clerk.isSignedIn) router.navigate(afterSignInUrl);
		else router.navigate("../");
	}, [clerk.__internal_setActiveInProgress]);
	if (!currentFactor) return /* @__PURE__ */ jsx(LoadingCard, {});
	if (showAllStrategies) return /* @__PURE__ */ jsx(SignInFactorTwoAlternativeMethods, {
		onBackLinkClick: toggleAllStrategies,
		onFactorSelected: selectFactor
	});
	switch (currentFactor?.strategy) {
		case "phone_code": return /* @__PURE__ */ jsx(SignInFactorTwoPhoneCodeCard, {
			factorAlreadyPrepared,
			onFactorPrepare: handleFactorPrepare,
			factor: currentFactor,
			onShowAlternativeMethodsClicked
		});
		case "totp": return /* @__PURE__ */ jsx(SignInFactorTwoTOTPCard, {
			factorAlreadyPrepared,
			onFactorPrepare: handleFactorPrepare,
			factor: currentFactor,
			onShowAlternativeMethodsClicked
		});
		case "backup_code": return /* @__PURE__ */ jsx(SignInFactorTwoBackupCodeCard, { onShowAlternativeMethodsClicked });
		case "email_code": return /* @__PURE__ */ jsx(SignInFactorTwoEmailCodeCard, {
			factorAlreadyPrepared,
			onFactorPrepare: handleFactorPrepare,
			factor: currentFactor,
			onShowAlternativeMethodsClicked
		});
		case "email_link": return /* @__PURE__ */ jsx(SignInFactorTwoEmailLinkCard, {
			factorAlreadyPrepared,
			onFactorPrepare: handleFactorPrepare,
			factor: currentFactor,
			onShowAlternativeMethodsClicked
		});
		default: return /* @__PURE__ */ jsx(LoadingCard, {});
	}
}
const SignInFactorTwo = withRedirectToSignInTask(withRedirectToAfterSignIn(withCardStateProvider(SignInFactorTwoInternal)));

//#endregion
export { SignInFactorTwo };
//# sourceMappingURL=SignInFactorTwo.js.map