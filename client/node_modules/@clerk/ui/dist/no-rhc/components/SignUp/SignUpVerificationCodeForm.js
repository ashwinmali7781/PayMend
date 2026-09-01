import { useRouter } from "../../router/RouteContext.js";
import { SignInContext } from "../../contexts/components/SignIn.js";
import { useSignUpContext } from "../../contexts/components/SignUp.js";
import { VerificationCodeCard } from "../../elements/VerificationCodeCard.js";
import { useCompleteSignUpFlow } from "./useCompleteSignUpFlow.js";
import React from "react";
import { forwardClerkQueryParams } from "@clerk/shared/internal/clerk-js/queryParams";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignUp/SignUpVerificationCodeForm.tsx
const SignUpVerificationCodeForm = (props) => {
	const { isCombinedFlow: _isCombinedFlow } = useSignUpContext();
	const { navigate } = useRouter();
	const completeSignUpFlow = useCompleteSignUpFlow();
	const isCombinedFlow = !!(!!React.useContext(SignInContext) && _isCombinedFlow);
	const goBack = () => {
		const params = forwardClerkQueryParams();
		return navigate(isCombinedFlow ? "../../" : "../", { searchParams: params });
	};
	const action = (code, resolve, reject) => {
		props.attempt(code).then(async (res) => {
			await resolve();
			return completeSignUpFlow({
				signUp: res,
				verifyEmailPath: "../verify-email-address",
				verifyPhonePath: "../verify-phone-number",
				protectCheckPath: "../protect-check",
				continuePath: "../continue"
			});
		}).catch((err) => {
			return reject(err);
		});
	};
	return /* @__PURE__ */ jsx(VerificationCodeCard, {
		cardTitle: props.cardTitle,
		cardSubtitle: props.cardSubtitle,
		resendButton: props.resendButton,
		onCodeEntryFinishedAction: action,
		onResendCodeClicked: props.prepare,
		safeIdentifier: props.safeIdentifier,
		onIdentityPreviewEditClicked: goBack,
		identityPreviewEditButtonAriaLabel: props.identityPreviewEditButtonAriaLabel,
		alternativeMethodsLabel: props.alternativeMethodsLabel,
		onShowAlternativeMethodsClicked: props.onShowAlternativeMethodsClicked,
		showAlternativeMethods: props.showAlternativeMethods
	});
};

//#endregion
export { SignUpVerificationCodeForm };
//# sourceMappingURL=SignUpVerificationCodeForm.js.map