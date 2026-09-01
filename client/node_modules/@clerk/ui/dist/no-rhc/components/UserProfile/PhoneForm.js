import { localizationKeys } from "../../localization/localizationKeys.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Button, Flex, Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { VerifyWithCode } from "./VerifyWithCode.js";
import React from "react";
import { useReverification, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/PhoneForm.tsx
const PhoneForm = withCardStateProvider((props) => {
	const { phoneId: id, onSuccess, onReset } = props;
	const { user } = useUser();
	const phoneNumberRef = React.useRef(user?.phoneNumbers.find((a) => a.id === id));
	const wizard = useWizard({ defaultStep: phoneNumberRef.current ? 1 : 0 });
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [/* @__PURE__ */ jsx(AddPhone, {
			resourceRef: phoneNumberRef,
			title: localizationKeys("userProfile.phoneNumberPage.title"),
			onSuccess: wizard.nextStep,
			onReset
		}), /* @__PURE__ */ jsx(VerifyPhone, {
			resourceRef: phoneNumberRef,
			title: localizationKeys("userProfile.phoneNumberPage.verifyTitle"),
			onSuccess,
			onReset
		})]
	});
});
const AddPhone = (props) => {
	const { title, onSuccess, onReset, onUseExistingNumberClick, resourceRef } = props;
	const card = useCardState();
	const { user } = useUser();
	const createPhoneNumber = useReverification((user, opt) => user.createPhoneNumber(opt));
	const phoneField = useFormControl("phoneNumber", "", {
		type: "tel",
		label: localizationKeys("formFieldLabel__phoneNumber"),
		isRequired: true
	});
	const canSubmit = phoneField.value.length > 1 && user?.username !== phoneField.value;
	const hasExistingNumber = !!user?.phoneNumbers?.length && onUseExistingNumberClick;
	const addPhone = async (e) => {
		e.preventDefault();
		if (!user) return;
		return createPhoneNumber(user, { phoneNumber: phoneField.value }).then((res) => {
			resourceRef.current = res;
			onSuccess();
		}).catch((e) => handleError(e, [phoneField], card.setError));
	};
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: title,
		gap: 1,
		children: /* @__PURE__ */ jsxs(Form.Root, {
			gap: 4,
			onSubmit: addPhone,
			children: [
				/* @__PURE__ */ jsx(Text, {
					localizationKey: localizationKeys("userProfile.phoneNumberPage.infoText"),
					colorScheme: "secondary"
				}),
				/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: phoneField.id,
					children: /* @__PURE__ */ jsx(Form.PhoneInput, {
						...phoneField.props,
						autoFocus: true
					})
				}),
				/* @__PURE__ */ jsxs(Flex, {
					justify: hasExistingNumber ? "between" : "end",
					children: [hasExistingNumber && /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						localizationKey: localizationKeys("userProfile.mfaPhoneCodePage.backButton"),
						onClick: onUseExistingNumberClick
					}), /* @__PURE__ */ jsx(FormButtons, {
						submitLabel: localizationKeys("userProfile.formButtonPrimary__add"),
						isDisabled: !canSubmit,
						onReset
					})]
				})
			]
		})
	});
};
const VerifyPhone = (props) => {
	const { title, onSuccess, resourceRef, onReset } = props;
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: title,
		headerSubtitle: localizationKeys("userProfile.phoneNumberPage.verifySubtitle", { identifier: resourceRef.current?.phoneNumber || "" }),
		children: /* @__PURE__ */ jsx(VerifyWithCode, {
			nextStep: onSuccess,
			identification: resourceRef.current,
			identifier: resourceRef.current?.phoneNumber,
			prepareVerification: resourceRef.current?.prepareVerification,
			onReset
		})
	});
};

//#endregion
export { AddPhone, PhoneForm };
//# sourceMappingURL=PhoneForm.js.map