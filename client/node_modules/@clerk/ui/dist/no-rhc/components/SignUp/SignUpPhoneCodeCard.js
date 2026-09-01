import { useFetch } from "../../hooks/useFetch.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCoreSignUp } from "../../contexts/CoreClientContext.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { handleError } from "../../utils/errorHandler.js";
import { LoadingCard } from "../../elements/LoadingCard.js";
import { SignUpVerificationCodeForm } from "./SignUpVerificationCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";
import { getAlternativePhoneCodeProviderData } from "@clerk/shared/alternativePhoneCode";

//#region src/components/SignUp/SignUpPhoneCodeCard.tsx
const SignUpPhoneCodeCard = withCardStateProvider(() => {
	const signUp = useCoreSignUp();
	const card = useCardState();
	const channel = signUp.verifications.phoneNumber.channel;
	const phoneVerificationStatus = signUp.verifications.phoneNumber.status;
	const hasPendingPhoneCodeVerification = phoneVerificationStatus === "unverified" && signUp.verifications.phoneNumber.strategy === "phone_code";
	const shouldAvoidPrepare = !signUp.status || phoneVerificationStatus === "verified";
	const isAlternativePhoneCodeProvider = !!channel && channel !== "sms";
	const channelToBeSent = isAlternativePhoneCodeProvider ? channel : void 0;
	const prepare = () => {
		if (shouldAvoidPrepare) return;
		return signUp.preparePhoneNumberVerification({
			strategy: "phone_code",
			channel: channelToBeSent
		}).catch((err) => handleError(err, [], card.setError));
	};
	useFetch(shouldAvoidPrepare || hasPendingPhoneCodeVerification || isAlternativePhoneCodeProvider ? void 0 : () => signUp.preparePhoneNumberVerification({
		strategy: "phone_code",
		channel: void 0
	}), {
		name: "signUp.preparePhoneNumberVerification",
		strategy: "phone_code",
		number: signUp.phoneNumber
	}, {
		staleTime: 100,
		onError: (err) => handleError(err, [], card.setError)
	});
	const attempt = (code) => signUp.attemptPhoneNumberVerification({ code });
	let cardTitleKey = localizationKeys("signUp.phoneCode.title");
	let cardSubtitleKey = localizationKeys("signUp.phoneCode.subtitle");
	let resendButtonKey = localizationKeys("signUp.phoneCode.resendButton");
	if (isAlternativePhoneCodeProvider) {
		const provider = getAlternativePhoneCodeProviderData(channel)?.name;
		cardTitleKey = localizationKeys("signUp.alternativePhoneCodeProvider.title", { provider: provider || "" });
		cardSubtitleKey = localizationKeys("signUp.alternativePhoneCodeProvider.subtitle", { provider: provider || "" });
		resendButtonKey = localizationKeys("signUp.alternativePhoneCodeProvider.resendButton");
	}
	const prepareWithSMS = () => {
		card.setLoading();
		card.setError(void 0);
		signUp.preparePhoneNumberVerification({
			strategy: "phone_code",
			channel: void 0
		}).catch((err) => handleError(err, [], card.setError)).finally(() => card.setIdle());
	};
	if (card.isLoading) return /* @__PURE__ */ jsx(LoadingCard, {});
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "phoneCode",
		children: /* @__PURE__ */ jsx(SignUpVerificationCodeForm, {
			cardTitle: cardTitleKey,
			cardSubtitle: cardSubtitleKey,
			resendButton: resendButtonKey,
			prepare,
			attempt,
			safeIdentifier: signUp.phoneNumber,
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__phoneNumber"),
			alternativeMethodsLabel: isAlternativePhoneCodeProvider ? localizationKeys("footerActionLink__alternativePhoneCodeProvider") : void 0,
			onShowAlternativeMethodsClicked: isAlternativePhoneCodeProvider ? prepareWithSMS : void 0,
			showAlternativeMethods: isAlternativePhoneCodeProvider ? true : void 0
		})
	});
});

//#endregion
export { SignUpPhoneCodeCard };
//# sourceMappingURL=SignUpPhoneCodeCard.js.map