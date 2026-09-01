import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flow } from "../../customizables/Flow.js";
import { SignInFactorOneCodeForm } from "./SignInFactorOneCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorOneForgotPasswordCard.tsx
const SignInFactorOneForgotPasswordCard = (props) => {
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "resetPassword",
		children: /* @__PURE__ */ jsx(SignInFactorOneCodeForm, {
			...props,
			showAlternativeMethods: false,
			cardTitle: localizationKeys("signIn.forgotPassword.title"),
			inputLabel: localizationKeys("signIn.forgotPassword.formTitle"),
			resendButton: localizationKeys("signIn.forgotPassword.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__identifier")
		})
	});
};

//#endregion
export { SignInFactorOneForgotPasswordCard };
//# sourceMappingURL=SignInFactorOneForgotPasswordCard.js.map