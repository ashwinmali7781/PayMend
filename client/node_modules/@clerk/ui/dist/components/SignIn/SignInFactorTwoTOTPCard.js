import { localizationKeys } from "../../localization/localizationKeys.js";
import { Flow } from "../../customizables/Flow.js";
import { SignInFactorTwoCodeForm } from "./SignInFactorTwoCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorTwoTOTPCard.tsx
const SignInFactorTwoTOTPCard = (props) => {
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "totp2Fa",
		children: /* @__PURE__ */ jsx(SignInFactorTwoCodeForm, {
			...props,
			cardTitle: localizationKeys("signIn.totpMfa.title"),
			cardSubtitle: localizationKeys("signIn.totpMfa.subtitle"),
			inputLabel: localizationKeys("signIn.totpMfa.formTitle")
		})
	});
};

//#endregion
export { SignInFactorTwoTOTPCard };
//# sourceMappingURL=SignInFactorTwoTOTPCard.js.map