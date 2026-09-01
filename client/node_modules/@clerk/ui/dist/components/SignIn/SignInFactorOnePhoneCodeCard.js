import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flow } from "../../customizables/Flow.js";
import { SignInFactorOneCodeForm } from "./SignInFactorOneCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorOnePhoneCodeCard.tsx
const SignInFactorOnePhoneCodeCard = (props) => {
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "phoneCode",
		children: /* @__PURE__ */ jsx(SignInFactorOneCodeForm, {
			...props,
			cardTitle: localizationKeys("signIn.phoneCode.title"),
			cardSubtitle: localizationKeys("signIn.phoneCode.subtitle"),
			inputLabel: localizationKeys("signIn.phoneCode.formTitle"),
			resendButton: localizationKeys("signIn.phoneCode.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__phoneNumber")
		})
	});
};

//#endregion
export { SignInFactorOnePhoneCodeCard };
//# sourceMappingURL=SignInFactorOnePhoneCodeCard.js.map