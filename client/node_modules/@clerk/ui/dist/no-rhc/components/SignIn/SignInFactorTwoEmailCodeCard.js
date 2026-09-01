import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { Flow } from "../../customizables/Flow.js";
import { SignInFactorTwoCodeForm } from "./SignInFactorTwoCodeForm.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorTwoEmailCodeCard.tsx
const SignInFactorTwoEmailCodeCard = (props) => {
	const signIn = useCoreSignIn();
	const prepare = () => {
		const { emailAddressId, strategy } = props.factor;
		return signIn.prepareSecondFactor({
			emailAddressId,
			strategy
		});
	};
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "emailCode2Fa",
		children: /* @__PURE__ */ jsx(SignInFactorTwoCodeForm, {
			...props,
			cardTitle: localizationKeys("signIn.emailCodeMfa.title"),
			cardSubtitle: localizationKeys("signIn.emailCodeMfa.subtitle"),
			inputLabel: localizationKeys("signIn.emailCodeMfa.formTitle"),
			resendButton: localizationKeys("signIn.emailCodeMfa.resendButton"),
			prepare
		})
	});
};

//#endregion
export { SignInFactorTwoEmailCodeCard };
//# sourceMappingURL=SignInFactorTwoEmailCodeCard.js.map