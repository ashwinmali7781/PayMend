import { localizationKeys } from "../../localization/localizationKeys.js";
import { Route } from "../../router/Route.js";
import { Protect } from "../../common/Gate.js";
import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Card } from "../../elements/Card/index.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { Wizard, useWizard } from "../../common/Wizard.js";
import { InviteMembersForm } from "../OrganizationProfile/InviteMembersForm.js";
import { InvitationsSentMessage } from "../OrganizationProfile/InviteMembersScreen.js";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/InviteMembers/InviteMembers.tsx
const InviteMembersModalInner = withCardStateProvider(() => {
	const { organization } = useOrganization();
	const card = useCardState();
	const wizard = useWizard({ onNextStep: () => card.setError(void 0) });
	const title = localizationKeys("organizationProfile.invitePage.title");
	const subtitle = localizationKeys("organizationProfile.invitePage.subtitle");
	if (!organization) return null;
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsx(Card.Content, { children: /* @__PURE__ */ jsxs(Wizard, {
		...wizard.props,
		children: [/* @__PURE__ */ jsx(FormContainer, {
			headerTitle: title,
			headerTitleTextVariant: "h2",
			headerSubtitle: subtitle,
			children: /* @__PURE__ */ jsx(InviteMembersForm, {
				onSuccess: wizard.nextStep,
				hideResetButton: true
			})
		}), /* @__PURE__ */ jsx(FormContainer, {
			headerTitle: title,
			headerTitleTextVariant: "h2",
			children: /* @__PURE__ */ jsx(InvitationsSentMessage, {})
		})]
	}) }), /* @__PURE__ */ jsx(Card.Footer, {})] });
});
const InviteMembersModal = (_props) => {
	return /* @__PURE__ */ jsx(Route, {
		path: "inviteMembers",
		children: /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
			value: "organization",
			children: /* @__PURE__ */ jsx(Protect, {
				permission: "org:sys_memberships:manage",
				children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(InviteMembersModalInner, {}) })
			})
		})
	});
};

//#endregion
export { InviteMembersModal };
//# sourceMappingURL=InviteMembers.js.map