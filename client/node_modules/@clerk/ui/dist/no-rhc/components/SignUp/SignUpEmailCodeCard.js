import { useFetch } from "../../hooks/useFetch.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCoreSignUp } from "../../contexts/CoreClientContext.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { handleError } from "../../utils/errorHandler.js";
import { SignUpVerificationCodeForm } from "./SignUpVerificationCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignUp/SignUpEmailCodeCard.tsx
const SignUpEmailCodeCard = () => {
	const signUp = useCoreSignUp();
	const card = useCardState();
	const emailVerificationStatus = signUp.verifications.emailAddress.status;
	const hasPendingEmailCodeVerification = emailVerificationStatus === "unverified" && signUp.verifications.emailAddress.strategy === "email_code";
	const shouldAvoidPrepare = !signUp.status || emailVerificationStatus === "verified";
	const shouldAvoidInitialPrepare = shouldAvoidPrepare || hasPendingEmailCodeVerification;
	const prepare = () => {
		if (shouldAvoidPrepare) return;
		return signUp.prepareEmailAddressVerification({ strategy: "email_code" }).catch((err) => handleError(err, [], card.setError));
	};
	useFetch(shouldAvoidInitialPrepare ? void 0 : () => signUp.prepareEmailAddressVerification({ strategy: "email_code" }), {
		name: "prepare",
		strategy: "email_code",
		number: signUp.emailAddress
	}, {
		staleTime: 100,
		onError: (err) => handleError(err, [], card.setError)
	});
	const attempt = (code) => signUp.attemptEmailAddressVerification({ code });
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "emailCode",
		children: /* @__PURE__ */ jsx(SignUpVerificationCodeForm, {
			cardTitle: localizationKeys("signUp.emailCode.title"),
			cardSubtitle: localizationKeys("signUp.emailCode.subtitle"),
			inputLabel: localizationKeys("signUp.emailCode.formSubtitle"),
			resendButton: localizationKeys("signUp.emailCode.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__emailAddress"),
			prepare,
			attempt,
			safeIdentifier: signUp.emailAddress
		})
	});
};

//#endregion
export { SignUpEmailCodeCard };
//# sourceMappingURL=SignUpEmailCodeCard.js.map