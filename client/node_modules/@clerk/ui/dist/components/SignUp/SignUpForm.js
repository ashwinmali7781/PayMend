import { localizationKeys } from "../../localization/localizationKeys.js";
import { useAppearance } from "../../customizables/AppearanceContext.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { Col } from "../../customizables/index.js";
import { Form } from "../../elements/Form.js";
import { LegalCheckbox } from "../../elements/LegalConsentCheckbox.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignUp/SignUpForm.tsx
const SignUpForm = (props) => {
	const { handleSubmit, fields, formState, canToggleEmailPhone, onlyLegalAcceptedMissing = false, handleEmailPhoneToggle } = props;
	const { showOptionalFields } = useAppearance().parsedOptions;
	const shouldShow = (name) => {
		if ((name === "emailAddress" || name === "phoneNumber") && canToggleEmailPhone) return !!fields[name];
		return !!fields[name] && (showOptionalFields || fields[name]?.required);
	};
	return /* @__PURE__ */ jsxs(Form.Root, {
		onSubmit: handleSubmit,
		gap: 8,
		children: [!onlyLegalAcceptedMissing && /* @__PURE__ */ jsxs(Col, {
			gap: 6,
			children: [
				(shouldShow("firstName") || shouldShow("lastName")) && /* @__PURE__ */ jsxs(Form.ControlRow, {
					elementId: "name",
					sx: { [mqu.sm]: { flexWrap: "wrap" } },
					children: [shouldShow("firstName") && /* @__PURE__ */ jsx(Form.PlainInput, {
						...formState.firstName.props,
						isRequired: fields.firstName?.required,
						isOptional: !fields.firstName?.required
					}), shouldShow("lastName") && /* @__PURE__ */ jsx(Form.PlainInput, {
						...formState.lastName.props,
						isRequired: fields.lastName?.required,
						isOptional: !fields.lastName?.required
					})]
				}),
				shouldShow("username") && /* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: "username",
					children: /* @__PURE__ */ jsx(Form.PlainInput, {
						...formState.username.props,
						isRequired: fields.username?.required,
						isOptional: !fields.username?.required
					})
				}),
				shouldShow("emailAddress") && /* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: "emailAddress",
					children: /* @__PURE__ */ jsx(Form.PlainInput, {
						...formState.emailAddress.props,
						isRequired: fields.emailAddress?.required,
						isOptional: !fields.emailAddress?.required,
						isDisabled: fields.emailAddress?.disabled,
						actionLabel: canToggleEmailPhone ? localizationKeys("signUp.start.actionLink__use_phone") : void 0,
						onActionClicked: canToggleEmailPhone ? () => handleEmailPhoneToggle("phoneNumber") : void 0
					})
				}),
				shouldShow("phoneNumber") && /* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: "phoneNumber",
					children: /* @__PURE__ */ jsx(Form.PhoneInput, {
						...formState.phoneNumber.props,
						isRequired: fields.phoneNumber?.required,
						isOptional: !fields.phoneNumber?.required,
						actionLabel: canToggleEmailPhone ? localizationKeys("signUp.start.actionLink__use_email") : void 0,
						onActionClicked: canToggleEmailPhone ? () => handleEmailPhoneToggle("emailAddress") : void 0
					})
				}),
				shouldShow("password") && /* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: "password",
					children: /* @__PURE__ */ jsx(Form.PasswordInput, {
						...formState.password.props,
						isRequired: fields.password?.required,
						isOptional: !fields.password?.required,
						autoComplete: "new-password"
					})
				})
			]
		}), /* @__PURE__ */ jsx(Col, {
			center: true,
			children: /* @__PURE__ */ jsxs(Col, {
				gap: 6,
				sx: { width: "100%" },
				children: [shouldShow("legalAccepted") && /* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: "legalAccepted",
					children: /* @__PURE__ */ jsx(LegalCheckbox, {
						...formState.legalAccepted.props,
						isRequired: fields.legalAccepted?.required
					})
				}), /* @__PURE__ */ jsx(Form.SubmitButton, {
					hasArrow: true,
					localizationKey: localizationKeys("formButtonPrimary")
				})]
			})
		})]
	});
};

//#endregion
export { SignUpForm };
//# sourceMappingURL=SignUpForm.js.map