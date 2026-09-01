import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSignOutContext } from "../../contexts/components/SignOut.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Col, Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { useMultipleSessions } from "../../hooks/useMultipleSessions.js";
import { useClerk, useReverification, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/DeleteUserForm.tsx
const DeleteUserForm = withCardStateProvider((props) => {
	const { onReset } = props;
	const card = useCardState();
	const { afterSignOutUrl, afterMultiSessionSingleSignOutUrl } = useSignOutContext();
	const { user } = useUser();
	const { t } = useLocalizations();
	const { otherSessions } = useMultipleSessions({ user });
	const { setActive } = useClerk();
	const deleteUserWithReverification = useReverification(() => user?.delete());
	const confirmationField = useFormControl("deleteConfirmation", "", {
		type: "text",
		label: localizationKeys("userProfile.deletePage.actionDescription"),
		isRequired: true,
		placeholder: localizationKeys("formFieldInputPlaceholder__confirmDeletionUserAccount")
	});
	const canSubmit = confirmationField.value === (t(localizationKeys("formFieldInputPlaceholder__confirmDeletionUserAccount")) || "Delete account");
	const deleteUser = async () => {
		if (!canSubmit) return;
		try {
			await deleteUserWithReverification();
			return await setActive({
				session: null,
				redirectUrl: otherSessions.length === 0 ? afterSignOutUrl : afterMultiSessionSingleSignOutUrl
			});
		} catch (e) {
			handleError(e, [], card.setError);
		}
	};
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: localizationKeys("userProfile.deletePage.title"),
		sx: (t) => ({ gap: t.space.$0x5 }),
		children: /* @__PURE__ */ jsxs(Form.Root, {
			onSubmit: deleteUser,
			children: [
				/* @__PURE__ */ jsxs(Col, {
					gap: 1,
					children: [/* @__PURE__ */ jsx(Text, {
						colorScheme: "secondary",
						localizationKey: localizationKeys("userProfile.deletePage.messageLine1")
					}), /* @__PURE__ */ jsx(Text, {
						colorScheme: "danger",
						localizationKey: localizationKeys("userProfile.deletePage.messageLine2")
					})]
				}),
				/* @__PURE__ */ jsx(Form.ControlRow, {
					elementId: confirmationField.id,
					children: /* @__PURE__ */ jsx(Form.PlainInput, {
						...confirmationField.props,
						ignorePasswordManager: true
					})
				}),
				/* @__PURE__ */ jsx(FormButtons, {
					submitLabel: localizationKeys("userProfile.deletePage.confirm"),
					colorScheme: "danger",
					isDisabled: !canSubmit,
					onReset
				})
			]
		})
	});
});

//#endregion
export { DeleteUserForm };
//# sourceMappingURL=DeleteUserForm.js.map