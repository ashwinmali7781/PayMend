import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Col } from "../../customizables/index.js";
import { Modal } from "../../elements/Modal.js";
import { Card } from "../../elements/Card/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { useMemo } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/RemoveDomainDialog.tsx
const RemoveDomainDialog = (props) => {
	if (!props.isOpen) return null;
	return /* @__PURE__ */ jsx(Modal, {
		handleClose: props.onClose,
		canCloseModal: false,
		portalRoot: props.contentRef,
		containerSx: (t) => ({
			alignItems: "center",
			position: "absolute",
			inset: 0,
			width: "auto",
			height: "auto",
			backgroundColor: "inherit",
			backdropFilter: `blur(${t.sizes.$2})`
		}),
		children: /* @__PURE__ */ jsx(RemoveDomainDialogContent, { ...props })
	});
};
const RemoveDomainDialogContent = withCardStateProvider((props) => {
	const { onClose, onRemove } = props;
	const card = useCardState();
	const subtitle = useMemo(() => props.isConnectionActive ? localizationKeys("configureSSO.organizationDomainsStep.removeDomainDialog.subtitle__active", { domain: props.domain }) : localizationKeys("configureSSO.organizationDomainsStep.removeDomainDialog.subtitle__inactive", { domain: props.domain }), []);
	const onSubmit = async () => {
		try {
			await onRemove();
			onClose();
		} catch (err) {
			handleError(err, [], card.setError);
		}
	};
	return /* @__PURE__ */ jsx(Card.Root, {
		elementDescriptor: descriptors.configureSSORemoveDomainDialog,
		sx: (t) => ({ borderRadius: t.radii.$md }),
		children: /* @__PURE__ */ jsx(Card.Content, {
			sx: (t) => ({
				textAlign: "start",
				padding: t.sizes.$5
			}),
			children: /* @__PURE__ */ jsx(FormContainer, {
				headerTitle: localizationKeys("configureSSO.organizationDomainsStep.removeDomainDialog.title"),
				headerSubtitle: subtitle,
				sx: (t) => ({ gap: t.space.$4 }),
				children: /* @__PURE__ */ jsx(Form.Root, {
					onSubmit,
					children: /* @__PURE__ */ jsx(Col, {
						gap: 4,
						children: /* @__PURE__ */ jsxs(FormButtonContainer, { children: [/* @__PURE__ */ jsx(Form.SubmitButton, {
							elementDescriptor: descriptors.configureSSORemoveDomainDialogSubmitButton,
							block: false,
							colorScheme: "danger",
							localizationKey: localizationKeys("configureSSO.organizationDomainsStep.removeDomainDialog.removeButton")
						}), /* @__PURE__ */ jsx(Form.ResetButton, {
							elementDescriptor: descriptors.configureSSORemoveDomainDialogCancelButton,
							block: false,
							localizationKey: localizationKeys("configureSSO.organizationDomainsStep.removeDomainDialog.cancelButton"),
							onClick: onClose
						})] })
					})
				})
			})
		})
	});
});

//#endregion
export { RemoveDomainDialog };
//# sourceMappingURL=RemoveDomainDialog.js.map