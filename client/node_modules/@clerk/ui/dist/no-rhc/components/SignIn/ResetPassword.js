import { useRouter } from "../../router/RouteContext.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { createPasswordError } from "../../utils/passwordUtils.js";
import { useConfirmPassword } from "../../hooks/usePassword.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Col } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { useSupportEmail } from "../../hooks/useSupportEmail.js";
import { navigateOnSignInProtectGate } from "./handleProtectCheck.js";
import { clerkInvalidFAPIResponse } from "@clerk/shared/internal/clerk-js/errors";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/ResetPassword.tsx
const ResetPasswordInternal = () => {
	const signIn = useCoreSignIn();
	const card = useCardState();
	const { navigate } = useRouter();
	const supportEmail = useSupportEmail();
	const { userSettings: { passwordSettings } } = useEnvironment();
	const { t, locale } = useLocalizations();
	const requiresNewPassword = signIn.status === "needs_new_password" && signIn.firstFactorVerification.strategy !== "reset_password_email_code" && signIn.firstFactorVerification.strategy !== "reset_password_phone_code";
	React.useEffect(() => {
		if (requiresNewPassword) card.setError(t(localizationKeys("signIn.resetPassword.requiredMessage")));
	}, []);
	const passwordField = useFormControl("password", "", {
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
	const canSubmit = isPasswordMatch;
	const validateForm = () => {
		if (passwordField.value) setConfirmPasswordFeedback(confirmField.value);
	};
	const resetPassword = async () => {
		if (!canSubmit) return;
		passwordField.clearFeedback();
		confirmField.clearFeedback();
		try {
			const res = await signIn.resetPassword({
				password: passwordField.value,
				signOutOfOtherSessions: sessionsField.checked
			});
			const { status, createdSessionId } = res;
			if (navigateOnSignInProtectGate(res, navigate, "../protect-check")) return;
			switch (status) {
				case "complete":
					if (createdSessionId) {
						const queryParams = new URLSearchParams();
						queryParams.set("createdSessionId", createdSessionId);
						return navigate(`../reset-password-success?${queryParams.toString()}`);
					}
					return console.error(clerkInvalidFAPIResponse(status, supportEmail));
				case "needs_second_factor": return navigate("../factor-two");
				default: return console.error(clerkInvalidFAPIResponse(status, supportEmail));
			}
		} catch (e) {
			return handleError(e, [passwordField, confirmField], card.setError);
		}
	};
	const goBack = () => {
		return navigate("../");
	};
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsx(Header.Root, {
			showLogo: true,
			children: /* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signIn.resetPassword.title") })
		}),
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		/* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.main,
			gap: 8,
			children: /* @__PURE__ */ jsxs(Form.Root, {
				onSubmit: resetPassword,
				onBlur: validateForm,
				gap: 8,
				children: [/* @__PURE__ */ jsxs(Col, {
					gap: 6,
					children: [
						/* @__PURE__ */ jsx("input", {
							readOnly: true,
							"data-testid": "hidden-identifier",
							id: "identifier-field",
							name: "identifier",
							value: signIn.identifier || "",
							style: { display: "none" }
						}),
						/* @__PURE__ */ jsx(Form.ControlRow, {
							elementId: passwordField.id,
							children: /* @__PURE__ */ jsx(Form.PasswordInput, {
								...passwordField.props,
								isRequired: true,
								autoFocus: true,
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
								autoComplete: "new-password"
							})
						}),
						!requiresNewPassword && /* @__PURE__ */ jsx(Form.ControlRow, {
							elementId: sessionsField.id,
							children: /* @__PURE__ */ jsx(Form.Checkbox, { ...sessionsField.props })
						})
					]
				}), /* @__PURE__ */ jsxs(Col, {
					gap: 3,
					children: [/* @__PURE__ */ jsx(Form.SubmitButton, {
						isDisabled: !canSubmit,
						localizationKey: localizationKeys("signIn.resetPassword.formButtonPrimary")
					}), /* @__PURE__ */ jsx(Card.Action, {
						elementId: "alternativeMethods",
						children: /* @__PURE__ */ jsx(Card.ActionLink, {
							elementDescriptor: descriptors.backLink,
							localizationKey: localizationKeys("backButton"),
							onClick: goBack
						})
					})]
				})]
			})
		})
	] }), /* @__PURE__ */ jsx(Card.Footer, {})] });
};
const ResetPassword = withCardStateProvider(ResetPasswordInternal);

//#endregion
export { ResetPassword };
//# sourceMappingURL=ResetPassword.js.map