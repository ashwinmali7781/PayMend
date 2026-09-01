import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { Flow } from "../../customizables/Flow.js";
import { SignInFactorTwoCodeForm } from "./SignInFactorTwoCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorTwoPhoneCodeCard.tsx
const SignInFactorTwoPhoneCodeCard = (props) => {
	const signIn = useCoreSignIn();
	const prepare = () => {
		const { phoneNumberId, strategy } = props.factor;
		return signIn.prepareSecondFactor({
			phoneNumberId,
			strategy
		});
	};
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "phoneCode2Fa",
		children: /* @__PURE__ */ jsx(SignInFactorTwoCodeForm, {
			...props,
			cardTitle: localizationKeys("signIn.phoneCodeMfa.title"),
			cardSubtitle: localizationKeys("signIn.phoneCodeMfa.subtitle"),
			inputLabel: localizationKeys("signIn.phoneCodeMfa.formTitle"),
			resendButton: localizationKeys("signIn.phoneCodeMfa.resendButton"),
			prepare
		})
	});
};

//#endregion
export { SignInFactorTwoPhoneCodeCard };
//# sourceMappingURL=SignInFactorTwoPhoneCodeCard.js.map