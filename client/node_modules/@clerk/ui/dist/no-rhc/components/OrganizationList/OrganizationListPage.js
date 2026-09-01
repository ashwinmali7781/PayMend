import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useOrganizationListContext } from "../../contexts/components/OrganizationList.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Box, Col, Flex, Spinner } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { CreateOrganizationForm } from "../CreateOrganization/CreateOrganizationForm.js";
import { Actions } from "../../elements/Actions.js";
import { CreateOrganizationAction } from "../../common/CreateOrganizationAction.js";
import { OrganizationPreviewSpinner } from "../../common/organizations/OrganizationPreview.js";
import { useOrganizationListInView } from "../../hooks/useOrganizationListInView.js";
import { PreviewListItems } from "./shared.js";
import { MembershipPreview, PersonalAccountPreview } from "./UserMembershipList.js";
import { InvitationPreview } from "./UserInvitationList.js";
import { SuggestionPreview } from "./UserSuggestionList.js";
import { useState } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationList/OrganizationListPage.tsx
const CreateOrganizationButton = ({ onCreateOrganizationClick }) => {
	return /* @__PURE__ */ jsx(CreateOrganizationAction, {
		elementDescriptor: descriptors.organizationListCreateOrganizationActionButton,
		label: localizationKeys("organizationList.action__createOrganization"),
		onClick: onCreateOrganizationClick,
		sx: (t) => ({
			borderTopWidth: t.borderWidths.$normal,
			borderTopStyle: t.borderStyles.$solid,
			borderTopColor: t.colors.$borderAlpha100,
			padding: `${t.space.$5} ${t.space.$5}`
		}),
		iconSx: (t) => ({
			width: t.sizes.$9,
			height: t.sizes.$6
		})
	});
};
const OrganizationListPage = withCardStateProvider(() => {
	const { userMemberships, userSuggestions, userInvitations } = useOrganizationListInView();
	const isLoading = userMemberships?.isLoading || userInvitations?.isLoading || userSuggestions?.isLoading;
	const hasAnyData = !!(userMemberships?.count || userInvitations?.count || userSuggestions?.count);
	const { hidePersonal } = useOrganizationListContext();
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, {
		sx: (t) => ({ padding: `${t.space.$4} ${t.space.$none} ${t.space.$none}` }),
		children: [isLoading && /* @__PURE__ */ jsx(Flex, {
			direction: "row",
			align: "center",
			justify: "center",
			sx: (t) => ({
				height: "100%",
				minHeight: t.sizes.$60
			}),
			children: /* @__PURE__ */ jsx(Spinner, {
				size: "lg",
				colorScheme: "primary",
				elementDescriptor: descriptors.spinner
			})
		}), !isLoading && /* @__PURE__ */ jsx(OrganizationListFlows, { showListInitially: !(hidePersonal && !hasAnyData) })]
	}), /* @__PURE__ */ jsx(Card.Footer, {})] });
});
const OrganizationListFlows = ({ showListInitially }) => {
	const card = useCardState();
	const { navigateAfterCreateOrganization, skipInvitationScreen } = useOrganizationListContext();
	const [isCreateOrganizationFlow, setCreateOrganizationFlow] = useState(!showListInitially);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [!isCreateOrganizationFlow && /* @__PURE__ */ jsx(OrganizationListPageList, { onCreateOrganizationClick: () => setCreateOrganizationFlow(true) }), isCreateOrganizationFlow && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Card.Alert, {
		sx: (t) => ({ margin: `${t.space.$none} ${t.space.$5}` }),
		children: card.error
	}), /* @__PURE__ */ jsx(Box, {
		sx: (t) => ({ padding: `${t.space.$none} ${t.space.$5} ${t.space.$5}` }),
		children: /* @__PURE__ */ jsx(CreateOrganizationForm, {
			flow: "organizationList",
			startPage: { headerTitle: localizationKeys("organizationList.createOrganization") },
			skipInvitationScreen,
			navigateAfterCreateOrganization: (org) => navigateAfterCreateOrganization(org).then(() => setCreateOrganizationFlow(false)),
			onCancel: showListInitially && isCreateOrganizationFlow ? () => setCreateOrganizationFlow(false) : void 0
		})
	})] })] });
};
const OrganizationListPageList = (props) => {
	const card = useCardState();
	const environment = useEnvironment();
	const { ref, userMemberships, userSuggestions, userInvitations } = useOrganizationListInView();
	const { hidePersonal } = useOrganizationListContext();
	const isLoading = userMemberships?.isLoading || userInvitations?.isLoading || userSuggestions?.isLoading;
	const hasNextPage = userMemberships?.hasNextPage || userInvitations?.hasNextPage || userSuggestions?.hasNextPage;
	const onCreateOrganizationClick = () => {
		card.setError(void 0);
		props.onCreateOrganizationClick();
	};
	const userInvitationsData = userInvitations.data?.filter((a) => !!a);
	const userSuggestionsData = userSuggestions.data?.filter((a) => !!a);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsxs(Header.Root, {
			sx: (t) => ({ padding: `${t.space.$4} ${t.space.$4} ${t.space.$none}` }),
			showLogo: true,
			children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys(!hidePersonal ? "organizationList.title" : "organizationList.titleWithoutPersonal") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("organizationList.subtitle", { applicationName: environment.displayConfig.applicationName }) })]
		}),
		/* @__PURE__ */ jsx(Card.Alert, {
			sx: (t) => ({ margin: `${t.space.$none} ${t.space.$5}` }),
			children: card.error
		}),
		/* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.main,
			children: /* @__PURE__ */ jsx(PreviewListItems, { children: /* @__PURE__ */ jsxs(Actions, { children: [
				/* @__PURE__ */ jsx(PersonalAccountPreview, {}),
				(userMemberships.count || 0) > 0 && userMemberships.data?.map((inv) => {
					return /* @__PURE__ */ jsx(MembershipPreview, { ...inv }, inv.id);
				}),
				!userMemberships.hasNextPage && userInvitationsData?.map((inv) => {
					return /* @__PURE__ */ jsx(InvitationPreview, { ...inv }, inv.id);
				}),
				!userMemberships.hasNextPage && !userInvitations.hasNextPage && userSuggestionsData?.map((inv) => {
					return /* @__PURE__ */ jsx(SuggestionPreview, { ...inv }, inv.id);
				}),
				(hasNextPage || isLoading) && /* @__PURE__ */ jsx(OrganizationPreviewSpinner, { ref }),
				/* @__PURE__ */ jsx(CreateOrganizationButton, { onCreateOrganizationClick })
			] }) })
		})
	] });
};

//#endregion
export { OrganizationListPage };
//# sourceMappingURL=OrganizationListPage.js.map