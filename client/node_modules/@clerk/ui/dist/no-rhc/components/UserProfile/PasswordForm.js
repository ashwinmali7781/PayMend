import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { createPasswordError } from "../../utils/passwordUtils.js";
import { useConfirmPassword } from "../../hooks/usePassword.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtonContainer, FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { InformationBox } from "../../elements/InformationBox.js";
import { useRef } from "react";
import { useReverification, useSession, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/PasswordForm.tsx
const generateSuccessPageText = (userHasPassword, sessionSignOut) => {
	const localizedTexts = [];
	if (userHasPassword) localizedTexts.push(localizationKeys("userProfile.passwordPage.successMessage__update"));
	else localizedTexts.push(localizationKeys("userProfile.passwordPage.successMessage__set"));
	if (sessionSignOut) localizedTexts.push(localizationKeys("userProfile.passwordPage.successMessage__signOutOfOtherSessions"));
	return localizedTexts;
};
const PasswordForm = withCardStateProvider((props) => {
	const { t, locale } = useLocalizations();
	const { onSuccess, onReset } = props;
	const { user } = useUser();
	const updatePasswordWithReverification = useReverification((user, opts) => user.updatePassword(...opts));
	if (!user) return null;
	const { userSettings: { passwordSettings }, authConfig: { reverification } } = useEnvironment();
	const { session } = useSession();
	const title = user.passwordEnabled ? localizationKeys("userProfile.passwordPage.title__update") : localizationKeys("userProfile.passwordPage.title__set");
	const card = useCardState();
	const passwordEditDisabled = user.enterpriseAccounts.some((ea) => ea.active);
	const currentPasswordRequired = user.passwordEnabled && !reverification;
	const successPagePropsRef = useRef({ title: localizationKeys("userProfile.passwordPage.title__set") });
	const currentPasswordField = useFormControl("currentPassword", "", {
		type: "password",
		label: localizationKeys("formFieldLabel__currentPassword"),
		isRequired: true
	});
	const passwordField = useFormControl("newPassword", "", {
		type: "password",
		label: localizationKeys("formFieldLabel__newPassword"),
		isRequired: true,
		validatePassword: true,
		buildErrorMessage: (errors) => createPasswordError(errors, {
			t,
			locale,
			passwordSettings
		})
	});
	const confirmField = useFormControl("confirmPassword", "", {
		type: "password",
		label: localizationKeys("formFieldLabel__confirmPassword"),
		isRequired: true
	});
	const sessionsField = useFormControl("signOutOfOtherSessions", "", {
		type: "checkbox",
		label: localizationKeys("formFieldLabel__signOutOfOtherSessions"),
		defaultChecked: true
	});
	const { setConfirmPasswordFeedback, isPasswordMatch } = useConfirmPassword({
		passwordField,
		confirmPasswordField: confirmField
	});
	const canSubmit = (currentPasswordRequired ? currentPasswordField.value && isPasswordMatch : isPasswordMatch) && passwordField.value && confirmField.value;
	const validateForm = () => {
		if (passwordField.value) setConfirmPasswordFeedback(confirmField.value);
	};
	const updatePassword = async () => {
		if (!canSubmit) return;
		try {
			successPagePropsRef.current = {
				title: user.passwordEnabled ? localizationKeys("userProfile.passwordPage.title__update") : localizationKeys("userProfile.passwordPage.title__set"),
				text: generateSuccessPageText(user.passwordEnabled, !!sessionsField.checked)
			};
			await updatePasswordWithReverification(user, [{
				newPassword: passwordField.value,
				signOutOfOtherSessions: sessionsField.checked,
				currentPassword: currentPasswordRequired ? currentPasswordField.value : void 0
			}]);
			onSuccess();
		} catch (e) {
			handleError(e, [
				currentPasswordField,
				passwordField,
				confirmField
			], card.setError);
		}
	};
	return /* @__PURE__ */ jsxs(FormContainer, {
		headerTitle: title,
		children: [passwordEditDisabled && /* @__PURE__ */ jsx(InformationBox, { message: localizationKeys("userProfile.passwordPage.readonly") }), /* @__PURE__ */ jsxs(Form.Root, {
			onSubmit: updatePassword,
			onBlur: validateForm,
			children: [
				/* @__PURE__ */ jsx("input", {
					readOnly: true,
					"data-testid": "hidden-identifier",
					id: "identifier-field",
					name: "identifier",
					value: session?.publicUserData.identifier || "",
					style: { display: "none" }
				}),
				currentPasswordRequired && /* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: currentPasswordField.id,
					children: /* @__PURE__ */ jsx(Form.PasswordInput, {
						...currentPasswordField.props,
						minLength: 6,
						isRequired: true,
						autoFocus: true,
						isDisabled: passwordEditDisabled
					})
				}),
				/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: passwordField.id,
					children: /* @__PURE__ */ jsx(Form.PasswordInput, {
						...passwordField.props,
						minLength: 6,
						isRequired: true,
						autoFocus: !user.passwordEnabled,
						isDisabled: passwordEditDisabled,
						autoComplete: "new-password"
					})
				}),
				/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: confirmField.id,
					children: /* @__PURE__ */ jsx(Form.PasswordInput, {
						...confirmField.props,
						onChange: (e) => {
							if (e.target.value) setConfirmPasswordFeedback(e.target.value);
							return confirmField.props.onChange(e);
						},
						isRequired: true,
						isDisabled: passwordEditDisabled,
						autoComplete: "new-password"
					})
				}),
				/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: sessionsField.id,
					children: /* @__PURE__ */ jsx(Form.Checkbox, {
						...sessionsField.props,
						description: localizationKeys("userProfile.passwordPage.checkboxInfoText__signOutOfOtherSessions"),
						isDisabled: passwordEditDisabled
					})
				}),
				passwordEditDisabled ? /* @__PURE__ */ jsx(FormButtonContainer, { children: /* @__PURE__ */ jsx(Form.ResetButton, {
					localizationKey: localizationKeys("userProfile.formButtonReset"),
					block: false,
					onClick: onReset
				}) }) : /* @__PURE__ */ jsx(FormButtons, {
					isDisabled: !canSubmit,
					onReset
				})
			]
		})]
	});
});

//#endregion
export { PasswordForm };
//# sourceMappingURL=PasswordForm.js.map