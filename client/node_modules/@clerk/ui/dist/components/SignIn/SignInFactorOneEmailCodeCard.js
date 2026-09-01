import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flow } from "../../customizables/Flow.js";
import { SignInFactorOneCodeForm } from "./SignInFactorOneCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorOneEmailCodeCard.tsx
const SignInFactorOneEmailCodeCard = (props) => {
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "emailCode",
		children: /* @__PURE__ */ jsx(SignInFactorOneCodeForm, {
			...props,
			cardTitle: localizationKeys("signIn.emailCode.title"),
			cardSubtitle: localizationKeys("signIn.emailCode.subtitle"),
			inputLabel: localizationKeys("signIn.emailCode.formTitle"),
			resendButton: localizationKeys("signIn.emailCode.resendButton"),
			identityPreviewEditButtonAriaLabel: localizationKeys("identityPreviewEditButton__emailAddress")
		})
	});
};

//#endregion
export { SignInFactorOneEmailCodeCard };
//# sourceMappingURL=SignInFactorOneEmailCodeCard.js.map