import { localizationKeys } from "../../localization/localizationKeys.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Card } from "../../elements/Card/index.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { APIKeyModal } from "./APIKeyModal.js";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/APIKeys/RevokeAPIKeyConfirmationModal.tsx
const RevokeAPIKeyConfirmationModal = ({ isOpen, onOpen, onClose, apiKeyID, apiKeyName, onRevokeSuccess, modalRoot }) => {
	const clerk = useClerk();
	const { t } = useLocalizations();
	const revokeField = useFormControl("apiKeyRevokeConfirmation", "", {
		type: "text",
		label: localizationKeys("apiKeys.revokeConfirmation.inputLabel"),
		placeholder: localizationKeys("apiKeys.revokeConfirmation.confirmationText"),
		isRequired: true
	});
	const canSubmit = revokeField.value === (t(localizationKeys("apiKeys.revokeConfirmation.confirmationText")) || "Revoke");
	const handleClose = () => {
		onClose();
		revokeField.setValue("");
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!apiKeyID || !canSubmit) return;
		await clerk.apiKeys.revoke({ apiKeyID });
		onRevokeSuccess?.();
		handleClose();
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ jsx(APIKeyModal, {
		handleOpen: onOpen,
		handleClose,
		canCloseModal: false,
		modalRoot,
		children: /* @__PURE__ */ jsx(Card.Root, {
			role: "alertdialog",
			elementDescriptor: descriptors.apiKeysRevokeModal,
			children: /* @__PURE__ */ jsx(Card.Content, {
				sx: (t) => ({
					textAlign: "start",
					padding: `${t.sizes.$4} ${t.sizes.$5} ${t.sizes.$4} ${t.sizes.$6}`
				}),
				children: /* @__PURE__ */ jsx(FormContainer, {
					headerTitle: localizationKeys("apiKeys.revokeConfirmation.formTitle", { apiKeyName }),
					headerSubtitle: localizationKeys("apiKeys.revokeConfirmation.formHint"),
					children: /* @__PURE__ */ jsxs(Form.Root, {
						onSubmit: handleSubmit,
						children: [/* @__PURE__ */ jsx(Form.ControlRow, {
							elementId: revokeField.id,
							elementDescriptor: descriptors.apiKeysRevokeModalInput,
							children: /* @__PURE__ */ jsx(Form.PlainInput, { ...revokeField.props })
						}), /* @__PURE__ */ jsx(FormButtons, {
							submitLabel: localizationKeys("apiKeys.revokeConfirmation.formButtonPrimary__revoke"),
							colorScheme: "danger",
							isDisabled: !canSubmit,
							onReset: handleClose,
							elementDescriptor: descriptors.apiKeysRevokeModalSubmitButton
						})]
					})
				})
			})
		})
	});
};

//#endregion
export { RevokeAPIKeyConfirmationModal };
//# sourceMappingURL=RevokeAPIKeyConfirmationModal.js.map