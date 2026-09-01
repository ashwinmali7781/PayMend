import { useClipboard } from "../../hooks/useClipboard.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgCheckmark from "../../icons/checkmark.js";
import SvgClipboard from "../../icons/clipboard.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Card } from "../../elements/Card/index.js";
import { Form } from "../../elements/Form.js";
import { FormButtons } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { ClipboardInput } from "../../elements/ClipboardInput.js";
import { APIKeyModal } from "./APIKeyModal.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/APIKeys/CopyAPIKeyModal.tsx
const CopyAPIKeyModal = ({ isOpen, onOpen, onClose, apiKeyName, apiKeySecret, modalRoot }) => {
	const apiKeyField = useFormControl("apiKeySecret", apiKeySecret, {
		type: "text",
		label: localizationKeys("formFieldLabel__apiKey"),
		isRequired: false
	});
	const { onCopy } = useClipboard(apiKeySecret);
	const { close: closeActionCard } = useActionContext();
	const handleSubmit = () => {
		onCopy();
		onClose();
		setTimeout(() => {
			closeActionCard();
		}, 100);
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ jsx(APIKeyModal, {
		handleOpen: onOpen,
		handleClose: onClose,
		canCloseModal: false,
		modalRoot,
		children: /* @__PURE__ */ jsx(Card.Root, {
			role: "alertdialog",
			elementDescriptor: descriptors.apiKeysCopyModal,
			children: /* @__PURE__ */ jsx(Card.Content, {
				sx: (t) => ({
					textAlign: "start",
					padding: `${t.sizes.$4} ${t.sizes.$5} ${t.sizes.$4} ${t.sizes.$6}`
				}),
				children: /* @__PURE__ */ jsx(FormContainer, {
					headerTitle: localizationKeys("apiKeys.copySecret.formTitle", { name: apiKeyName }),
					headerSubtitle: localizationKeys("apiKeys.copySecret.formHint"),
					children: /* @__PURE__ */ jsxs(Form.Root, {
						onSubmit: handleSubmit,
						children: [/* @__PURE__ */ jsx(Form.ControlRow, {
							elementDescriptor: descriptors.apiKeysCopyModalInput,
							sx: { flex: 1 },
							children: /* @__PURE__ */ jsx(Form.CommonInputWrapper, {
								...apiKeyField.props,
								children: /* @__PURE__ */ jsx(ClipboardInput, {
									value: apiKeySecret,
									readOnly: true,
									sx: { width: "100%" },
									copyIcon: SvgClipboard,
									copiedIcon: SvgCheckmark
								})
							})
						}), /* @__PURE__ */ jsx(FormButtons, {
							submitLabel: localizationKeys("apiKeys.copySecret.formButtonPrimary__copyAndClose"),
							hideReset: true,
							elementDescriptor: descriptors.apiKeysCopyModalSubmitButton
						})]
					})
				})
			})
		})
	});
};

//#endregion
export { CopyAPIKeyModal };
//# sourceMappingURL=CopyAPIKeyModal.js.map