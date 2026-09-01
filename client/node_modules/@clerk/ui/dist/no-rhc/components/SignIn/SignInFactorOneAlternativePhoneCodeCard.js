import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flow } from "../../customizables/Flow.js";
import { SignInFactorOneAlternativeChannelCodeForm } from "./SignInFactorOneAlternativeChannelCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";
import { getAlternativePhoneCodeProviderData } from "@clerk/shared/alternativePhoneCode";

//#region src/components/SignIn/SignInFactorOneAlternativePhoneCodeCard.tsx
const SignInFactorOneAlternativePhoneCodeCard = (props) => {
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "phoneCode",
		children: /* @__PURE__ */ jsx(SignInFactorOneAlternativeChannelCodeForm, {
			...props,
			cardTitle: localizationKeys("signIn.alternativePhoneCodeProvider.title", { provider: getAlternativePhoneCodeProviderData(props.factor.channel)?.name || "" }),
			cardSubtitle: localizationKeys("signIn.alternativePhoneCodeProvider.subtitle"),
			inputLabel: localizationKeys("signIn.alternativePhoneCodeProvider.formTitle"),
			resendButton: localizationKeys("signIn.alternativePhoneCodeProvider.resendButton")
		})
	});
};

//#endregion
export { SignInFactorOneAlternativePhoneCodeCard };
//# sourceMappingURL=SignInFactorOneAlternativePhoneCodeCard.js.map