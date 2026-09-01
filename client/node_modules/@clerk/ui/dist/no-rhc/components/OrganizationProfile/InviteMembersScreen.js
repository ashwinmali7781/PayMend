import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgEnvelope from "../../icons/envelope.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Flex, Text } from "../../customizables/index.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { SuccessPage } from "../../elements/SuccessPage.js";
import { InviteMembersForm } from "./InviteMembersForm.js";
import { IconCircle } from "../../elements/IconCircle.js";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/InviteMembersScreen.tsx
const InviteMembersScreen = withCardStateProvider((props) => {
	const { close } = useActionContext();
	const { onReset = close } = props;
	const title = localizationKeys("organizationProfile.invitePage.title");
	const subtitle = localizationKeys("organizationProfile.invitePage.subtitle");
	const card = useCardState();
	const wizard = useWizard({ onNextStep: () => card.setError(void 0) });
	const { organization } = useOrganization();
	if (!organization) return null;
	return /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [/* @__PURE__ */ jsx(FormContainer, {
			headerTitle: title,
			headerSubtitle: subtitle,
			children: /* @__PURE__ */ jsx(InviteMembersForm, {
				onSuccess: wizard.nextStep,
				onReset
			})
		}), /* @__PURE__ */ jsx(SuccessPage, {
			title,
			onFinish: close,
			contents: /* @__PURE__ */ jsx(InvitationsSentMessage, {})
		})]
	});
});
const InvitationsSentMessage = () => {
	return /* @__PURE__ */ jsxs(Flex, {
		direction: "col",
		center: true,
		gap: 4,
		children: [/* @__PURE__ */ jsx(IconCircle, {
			boxElementDescriptor: descriptors.invitationsSentIconBox,
			iconElementDescriptor: descriptors.invitationsSentIcon,
			icon: SvgEnvelope
		}), /* @__PURE__ */ jsx(Text, { localizationKey: localizationKeys("organizationProfile.invitePage.successMessage") })]
	});
};

//#endregion
export { InvitationsSentMessage, InviteMembersScreen };
//# sourceMappingURL=InviteMembersScreen.js.map