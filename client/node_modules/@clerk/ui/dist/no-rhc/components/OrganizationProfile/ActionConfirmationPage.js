import { localizationKeys } from "../../localization/localizationKeys.js";
import { useOrganizationProfileContext } from "../../contexts/components/OrganizationProfile.js";
import { useFormControl } from "../../utils/useFormControl.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Col, Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { SuccessPage } from "../../elements/SuccessPage.js";
import { organizationListParams } from "../OrganizationSwitcher/utils.js";
import { useOrganization, useOrganizationList, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/ActionConfirmationPage.tsx
const useLeaveWithRevalidations = (leavePromise) => {
	const card = useCardState();
	const { navigateAfterLeaveOrganization } = useOrganizationProfileContext();
	const { userMemberships, userInvitations } = useOrganizationList({
		userMemberships: organizationListParams.userMemberships,
		userInvitations: organizationListParams.userInvitations
	});
	return () => card.runAsync(async () => {
		await leavePromise?.();
	}).then(() => {
		userMemberships.revalidate?.();
		userInvitations.revalidate?.();
		navigateAfterLeaveOrganization();
	});
};
const LeaveOrganizationForm = (props) => {
	const { organization } = useOrganization();
	const { user } = useUser();
	const leaveOrg = useLeaveWithRevalidations(() => user.leaveOrganization(organization.id));
	if (!organization || !user) return null;
	return /* @__PURE__ */ jsx(ActionConfirmationPage, {
		organizationName: organization.name,
		title: localizationKeys("organizationProfile.profilePage.dangerSection.leaveOrganization.title"),
		messageLine1: localizationKeys("organizationProfile.profilePage.dangerSection.leaveOrganization.messageLine1"),
		messageLine2: localizationKeys("organizationProfile.profilePage.dangerSection.leaveOrganization.messageLine2"),
		actionDescription: localizationKeys("organizationProfile.profilePage.dangerSection.leaveOrganization.actionDescription", { organizationName: organization.name }),
		submitLabel: localizationKeys("organizationProfile.profilePage.dangerSection.leaveOrganization.title"),
		successMessage: localizationKeys("organizationProfile.profilePage.dangerSection.leaveOrganization.successMessage"),
		onConfirmation: leaveOrg,
		...props
	});
};
const DeleteOrganizationForm = (props) => {
	const { organization, membership } = useOrganization();
	const deleteOrg = useLeaveWithRevalidations(organization?.destroy);
	if (!organization || !membership) return null;
	return /* @__PURE__ */ jsx(ActionConfirmationPage, {
		organizationName: organization.name,
		title: localizationKeys("organizationProfile.profilePage.dangerSection.deleteOrganization.title"),
		messageLine1: localizationKeys("organizationProfile.profilePage.dangerSection.deleteOrganization.messageLine1"),
		messageLine2: localizationKeys("organizationProfile.profilePage.dangerSection.deleteOrganization.messageLine2"),
		actionDescription: localizationKeys("organizationProfile.profilePage.dangerSection.deleteOrganization.actionDescription", { organizationName: organization.name }),
		submitLabel: localizationKeys("organizationProfile.profilePage.dangerSection.deleteOrganization.title"),
		successMessage: localizationKeys("organizationProfile.profilePage.dangerSection.deleteOrganization.successMessage"),
		onConfirmation: deleteOrg,
		...props
	});
};
const ActionConfirmationPage = withCardStateProvider((props) => {
	const { title, messageLine1, messageLine2, actionDescription, organizationName, successMessage, submitLabel, onSuccess, onReset, onConfirmation, colorScheme = "danger" } = props;
	const wizard = useWizard();
	const card = useCardState();
	const confirmationField = useFormControl("deleteOrganizationConfirmation", "", {
		type: "text",
		label: actionDescription,
		isRequired: true,
		placeholder: organizationName
	});
	const canSubmit = actionDescription ? confirmationField.value === organizationName : true;
	const handleSubmit = async () => {
		if (!canSubmit) return;
		try {
			await onConfirmation().then(() => wizard.nextStep());
		} catch (e) {
			handleError(e, [], card.setError);
		}
	};
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [/* @__PURE__ */ jsx(FormContainer, {
			headerTitle: title,
			gap: 1,
			children: /* @__PURE__ */ jsxs(Form.Root, {
				onSubmit: handleSubmit,
				children: [
					/* @__PURE__ */ jsxs(Col, { children: [/* @__PURE__ */ jsx(Text, {
						localizationKey: messageLine1,
						colorScheme: "secondary"
					}), /* @__PURE__ */ jsx(Text, {
						localizationKey: messageLine2,
						colorScheme: "danger"
					})] }),
					/* @__PURE__ */ jsx(Form.ControlRow, {
						elementId: confirmationField.id,
						children: /* @__PURE__ */ jsx(Form.PlainInput, { ...confirmationField.props })
					}),
					/* @__PURE__ */ jsxs(FormButtonContainer, { children: [/* @__PURE__ */ jsx(Form.SubmitButton, {
						block: false,
						colorScheme,
						localizationKey: submitLabel,
						isDisabled: !canSubmit
					}), /* @__PURE__ */ jsx(Form.ResetButton, {
						localizationKey: localizationKeys("userProfile.formButtonReset"),
						block: false,
						onClick: onReset
					})] })
				]
			})
		}), /* @__PURE__ */ jsx(SuccessPage, {
			title,
			text: successMessage,
			onFinish: onSuccess
		})]
	});
});

//#endregion
export { DeleteOrganizationForm, LeaveOrganizationForm };
//# sourceMappingURL=ActionConfirmationPage.js.map