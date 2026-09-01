import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Button } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { useFieldOTP } from "../../elements/CodeControl.js";
import { Form } from "../../elements/Form.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/VerifyWithCode.tsx
const VerifyWithCode = (props) => {
	const card = useCardState();
	const { nextStep, identification, identifier, onReset, prepareVerification } = props;
	const prepare = () => {
		return prepareVerification?.()?.catch((err) => handleError(err, [], card.setError));
	};
	const otp = useFieldOTP({
		onCodeEntryFinished: (code, resolve, reject) => {
			identification?.attemptVerification({ code }).then(() => resolve()).catch(reject);
		},
		onResendCodeClicked: prepare,
		onResolve: nextStep
	});
	React.useEffect(() => {
		prepare();
	}, []);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Form.OTPInput, {
		...otp,
		label: localizationKeys("userProfile.emailAddressPage.emailCode.formTitle"),
		description: localizationKeys("userProfile.emailAddressPage.emailCode.formSubtitle", { identifier: identifier || "" }),
		resendButton: localizationKeys("userProfile.emailAddressPage.emailCode.resendButton"),
		centerAlign: false
	}), /* @__PURE__ */ jsxs(FormButtonContainer, { children: [/* @__PURE__ */ jsx(Button, {
		isLoading: otp.isLoading,
		localizationKey: localizationKeys("formButtonPrimary__verify"),
		elementDescriptor: descriptors.formButtonPrimary,
		onClick: otp.onFakeContinue
	}), /* @__PURE__ */ jsx(Button, {
		variant: "ghost",
		isDisabled: otp.isLoading,
		localizationKey: localizationKeys("userProfile.formButtonReset"),
		elementDescriptor: descriptors.formButtonReset,
		onClick: onReset
	})] })] });
};

//#endregion
export { VerifyWithCode };
//# sourceMappingURL=VerifyWithCode.js.map