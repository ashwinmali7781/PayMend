import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgAdd from "../../icons/add.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { CreateOrganizationAction } from "../../common/CreateOrganizationAction.js";
import { UserInvitationSuggestionList } from "./UserInvitationSuggestionList.js";
import { UserMembershipList } from "./UserMembershipList.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationSwitcher/OtherOrganizationActions.tsx
const CreateOrganizationButton = ({ onCreateOrganizationClick }) => {
	return /* @__PURE__ */ jsx(CreateOrganizationAction, {
		elementDescriptor: descriptors.organizationSwitcherPopoverActionButton,
		elementId: descriptors.organizationSwitcherPopoverActionButton.setId("createOrganization"),
		iconBoxElementDescriptor: descriptors.organizationSwitcherPopoverActionButtonIconBox,
		iconBoxElementId: descriptors.organizationSwitcherPopoverActionButtonIconBox.setId("createOrganization"),
		iconElementDescriptor: descriptors.organizationSwitcherPopoverActionButtonIcon,
		iconElementId: descriptors.organizationSwitcherPopoverActionButtonIcon.setId("createOrganization"),
		icon: SvgAdd,
		label: localizationKeys("organizationSwitcher.action__createOrganization"),
		onClick: onCreateOrganizationClick,
		sx: (t) => ({ padding: `${t.space.$4} ${t.space.$5}` }),
		iconSx: (t) => ({
			width: t.sizes.$9,
			height: t.sizes.$6
		}),
		iconBoxSx: (t) => ({
			width: t.sizes.$9,
			height: t.sizes.$9
		}),
		spinnerSize: "sm"
	});
};
const OrganizationActionList = (props) => {
	const { onCreateOrganizationClick, onPersonalWorkspaceClick, onOrganizationClick } = props;
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx(UserInvitationSuggestionList, { onOrganizationClick }),
		/* @__PURE__ */ jsx(UserMembershipList, {
			onPersonalWorkspaceClick,
			onOrganizationClick
		}),
		/* @__PURE__ */ jsx(CreateOrganizationButton, { onCreateOrganizationClick })
	] });
};

//#endregion
export { OrganizationActionList };
//# sourceMappingURL=OtherOrganizationActions.js.map