import { useEnvironment } from "../../../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../../../localization/localizationKeys.js";
import { createPasswordError } from "../../../../utils/passwordUtils.js";
import { useConfirmPassword } from "../../../../hooks/usePassword.js";
import { useSignOutContext } from "../../../../contexts/components/SignOut.js";
import { useSessionTasksContext, useTaskResetPasswordContext } from "../../../../contexts/components/SessionTasks.js";
import { withCoreSessionSwitchGuard } from "../../../../contexts/CoreSessionContext.js";
import { useLocalizations } from "../../../../localization/makeLocalizable.js";
import { useFormControl } from "../../../../utils/useFormControl.js";
import { descriptors } from "../../../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../../../elements/contexts/index.js";
import { Flow } from "../../../../customizables/Flow.js";
import { Col } from "../../../../customizables/index.js";
import { Card } from "../../../../elements/Card/index.js";
import { Header } from "../../../../elements/Header.js";
import { handleError } from "../../../../utils/errorHandler.js";
import { Form } from "../../../../elements/Form.js";
import { useMultipleSessions } from "../../../../hooks/useMultipleSessions.js";
import { withTaskGuard } from "../shared/withTaskGuard.js";
import { useClerk, useReverification } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskResetPassword/index.tsx
const TaskResetPasswordInternal = () => {
	const clerk = useClerk();
	const card = useCardState();
	const { userSettings: { passwordSettings } } = useEnvironment();
	const { t, locale } = useLocalizations();
	const { redirectUrlComplete } = useTaskResetPasswordContext();
	const { otherSessions } = useMultipleSessions({ user: clerk.user });
	const { navigateAfterSignOut, navigateAfterMultiSessionSingleSignOutUrl } = useSignOutContext();
	const updatePasswordWithReverification = useReverification((user, opts) => user.updatePassword(...opts));
	const { navigateOnSetActive } = useSessionTasksContext();
	const handleSignOut = () => {
		if (otherSessions.length === 0) return clerk?.signOut(navigateAfterSignOut);
		return clerk?.signOut(navigateAfterMultiSessionSingleSignOutUrl, { sessionId: clerk.session?.id });
	};
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
	const canSubmit = isPasswordMatch;
	const validateForm = () => {
		if (passwordField.value) setConfirmPasswordFeedback(confirmField.value);
	};
	const resetPassword = () => {
		return card.runAsync(async () => {
			if (!canSubmit || !clerk.user) return;
			passwordField.clearFeedback();
			confirmField.clearFeedback();
			try {
				await updatePasswordWithReverification(clerk.user, [{
					newPassword: passwordField.value,
					signOutOfOtherSessions: sessionsField.checked
				}]);
				await clerk.setActive({
					session: clerk.session,
					navigate: async ({ session, decorateUrl }) => {
						await navigateOnSetActive?.({
							session,
							redirectUrlComplete,
							decorateUrl
						});
					}
				});
			} catch (e) {
				return handleError(e, [passwordField, confirmField], card.setError);
			}
		});
	};
	const identifier = clerk.user?.primaryEmailAddress?.emailAddress ?? clerk.user?.username;
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "taskResetPassword",
		children: /* @__PURE__ */ jsx(Flow.Part, {
			part: "resetPassword",
			children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
				/* @__PURE__ */ jsxs(Header.Root, {
					showLogo: true,
					children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("taskResetPassword.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("taskResetPassword.subtitle") })]
				}),
				/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
				/* @__PURE__ */ jsx(Col, {
					elementDescriptor: descriptors.main,
					gap: 8,
					children: /* @__PURE__ */ jsxs(Form.Root, {
						onSubmit: () => {
							resetPassword();
						},
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
									value: clerk.user?.primaryEmailAddress?.emailAddress || clerk.user?.username || "",
									style: { display: "none" }
								}),
								/* @__PURE__ */ jsx(Form.ControlRow, {
									elementId: passwordField.id,
									children: /* @__PURE__ */ jsx(Form.PasswordInput, {
										...passwordField.props,
										isRequired: true,
										minLength: 6
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
								/* @__PURE__ */ jsx(Form.ControlRow, {
									elementId: sessionsField.id,
									children: /* @__PURE__ */ jsx(Form.Checkbox, { ...sessionsField.props })
								})
							]
						}), /* @__PURE__ */ jsx(Col, {
							gap: 3,
							children: /* @__PURE__ */ jsx(Form.SubmitButton, {
								isLoading: card.isLoading,
								isDisabled: !canSubmit,
								localizationKey: localizationKeys("taskResetPassword.formButtonPrimary")
							})
						})]
					})
				})
			] }), /* @__PURE__ */ jsx(Card.Footer, { children: /* @__PURE__ */ jsxs(Card.Action, {
				elementId: "signOut",
				gap: 2,
				justify: "center",
				sx: () => ({ width: "100%" }),
				children: [identifier && /* @__PURE__ */ jsx(Card.ActionText, {
					truncate: true,
					localizationKey: localizationKeys("taskResetPassword.signOut.actionText", { identifier })
				}), /* @__PURE__ */ jsx(Card.ActionLink, {
					sx: () => ({ flexShrink: 0 }),
					onClick: () => {
						handleSignOut();
					},
					localizationKey: localizationKeys("taskResetPassword.signOut.actionLink")
				})]
			}) })] })
		})
	});
};
const TaskResetPassword = withCoreSessionSwitchGuard(withTaskGuard(withCardStateProvider(TaskResetPasswordInternal), "reset-password"));

//#endregion
export { TaskResetPassword };
//# sourceMappingURL=index.js.map