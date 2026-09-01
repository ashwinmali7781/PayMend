import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { LoadingCard } from "../../elements/LoadingCard.js";
import { withRedirectToAfterSignIn, withRedirectToSignInTask } from "../../common/withRedirect.js";
import { SignInFactorTwoAlternativeMethods } from "./SignInFactorTwoAlternativeMethods.js";
import { SignInFactorTwoEmailCodeCard } from "./SignInFactorTwoEmailCodeCard.js";
import { SignInFactorTwoEmailLinkCard } from "./SignInFactorTwoEmailLinkCard.js";
import { SignInFactorTwoPhoneCodeCard } from "./SignInFactorTwoPhoneCodeCard.js";
import { useSecondFactorSelection } from "./useSecondFactorSelection.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInClientTrust.tsx
function SignInClientTrustInternal() {
	const signIn = useCoreSignIn();
	const { currentFactor, factorAlreadyPrepared, handleFactorPrepare, selectFactor, showAllStrategies, toggleAllStrategies } = useSecondFactorSelection(signIn.supportedSecondFactors);
	const onShowAlternativeMethodsClicked = signIn.supportedSecondFactors && signIn.supportedSecondFactors.length > 1 ? toggleAllStrategies : void 0;
	if (!currentFactor) return /* @__PURE__ */ jsx(LoadingCard, {});
	if (showAllStrategies) return /* @__PURE__ */ jsx(SignInFactorTwoAlternativeMethods, {
		onBackLinkClick: toggleAllStrategies,
		onFactorSelected: selectFactor
	});
	switch (currentFactor?.strategy) {
		case "phone_code": return /* @__PURE__ */ jsx(SignInFactorTwoPhoneCodeCard, {
			showClientTrustNotice: true,
			factorAlreadyPrepared,
			onFactorPrepare: handleFactorPrepare,
			factor: currentFactor,
			onShowAlternativeMethodsClicked
		});
		case "email_code": return /* @__PURE__ */ jsx(SignInFactorTwoEmailCodeCard, {
			showClientTrustNotice: true,
			factorAlreadyPrepared,
			onFactorPrepare: handleFactorPrepare,
			factor: currentFactor,
			onShowAlternativeMethodsClicked
		});
		case "email_link": return /* @__PURE__ */ jsx(SignInFactorTwoEmailLinkCard, {
			showClientTrustNotice: true,
			factorAlreadyPrepared,
			onFactorPrepare: handleFactorPrepare,
			factor: currentFactor,
			onShowAlternativeMethodsClicked
		});
		default: return /* @__PURE__ */ jsx(LoadingCard, {});
	}
}
const SignInClientTrust = withRedirectToSignInTask(withRedirectToAfterSignIn(withCardStateProvider(SignInClientTrustInternal)));

//#endregion
export { SignInClientTrust };
//# sourceMappingURL=SignInClientTrust.js.map