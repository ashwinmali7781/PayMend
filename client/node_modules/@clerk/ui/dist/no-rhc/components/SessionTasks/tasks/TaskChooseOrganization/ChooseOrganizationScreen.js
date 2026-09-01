import { localizationKeys } from "../../../../localization/localizationKeys.js";
import { useSessionTasksContext, useTaskChooseOrganizationContext } from "../../../../contexts/components/SessionTasks.js";
import { useLocalizations } from "../../../../localization/makeLocalizable.js";
import { descriptors } from "../../../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../../../elements/contexts/index.js";
import { Col, Text } from "../../../../customizables/index.js";
import { Card } from "../../../../elements/Card/index.js";
import { Header } from "../../../../elements/Header.js";
import { handleError } from "../../../../utils/errorHandler.js";
import { organizationListParams, populateCacheUpdateItem } from "../../../OrganizationSwitcher/utils.js";
import { Actions } from "../../../../elements/Actions.js";
import { CreateOrganizationAction } from "../../../../common/CreateOrganizationAction.js";
import { OrganizationPreview } from "../../../../elements/OrganizationPreview.js";
import { OrganizationPreviewButton, OrganizationPreviewListItem, OrganizationPreviewListItemButton, OrganizationPreviewListItems, OrganizationPreviewSpinner, sharedMainIdentifierSx } from "../../../../common/organizations/OrganizationPreview.js";
import { useOrganizationListInView } from "../../../../hooks/useOrganizationListInView.js";
import { isClerkAPIResponseError } from "@clerk/shared/error";
import React, { useState } from "react";
import { useClerk, useOrganizationList, useUser } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskChooseOrganization/ChooseOrganizationScreen.tsx
const ChooseOrganizationScreen = (props) => {
	const card = useCardState();
	const { user } = useUser();
	const { ref, userMemberships, userSuggestions, userInvitations } = useOrganizationListInView();
	const isLoading = userMemberships?.isLoading || userInvitations?.isLoading || userSuggestions?.isLoading;
	const hasNextPage = userMemberships?.hasNextPage || userInvitations?.hasNextPage || userSuggestions?.hasNextPage;
	const userInvitationsData = userInvitations.data?.filter((a) => !!a);
	const userSuggestionsData = userSuggestions.data?.filter((a) => !!a);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsxs(Header.Root, {
			showLogo: true,
			sx: (t) => ({ padding: `${t.space.$none} ${t.space.$8}` }),
			children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("taskChooseOrganization.chooseOrganization.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: user?.createOrganizationEnabled ? localizationKeys("taskChooseOrganization.chooseOrganization.subtitle") : localizationKeys("taskChooseOrganization.chooseOrganization.subtitle__createOrganizationDisabled") })]
		}),
		/* @__PURE__ */ jsx(Card.Alert, {
			sx: (t) => ({ margin: `${t.space.$none} ${t.space.$8}` }),
			children: card.error
		}),
		/* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.main,
			children: /* @__PURE__ */ jsx(OrganizationPreviewListItems, {
				elementDescriptor: descriptors.taskChooseOrganizationPreviewItems,
				children: /* @__PURE__ */ jsxs(Actions, { children: [
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
					/* @__PURE__ */ jsx(CreateOrganizationButton, { onCreateOrganizationClick: () => {
						card.setError(void 0);
						props.onCreateOrganizationClick();
					} })
				] })
			})
		})
	] });
};
const MembershipPreview = (props) => {
	const { user } = useUser();
	const card = useCardState();
	const { navigateOnSetActive } = useSessionTasksContext();
	const { redirectUrlComplete } = useTaskChooseOrganizationContext();
	const { isLoaded, setActive } = useOrganizationList();
	const { t } = useLocalizations();
	if (!isLoaded) return null;
	const handleOrganizationClicked = (organization) => {
		return card.runAsync(async () => {
			try {
				await setActive({
					organization,
					navigate: async ({ session, decorateUrl }) => {
						await navigateOnSetActive?.({
							session,
							redirectUrlComplete,
							decorateUrl
						});
					}
				});
			} catch (err) {
				if (!isClerkAPIResponseError(err)) {
					handleError(err, [], card.setError);
					return;
				}
				switch (err.errors?.[0]?.code) {
					case "organization_not_found_or_unauthorized":
					case "not_a_member_in_organization":
						if (user?.createOrganizationEnabled) card.setError(t(localizationKeys("unstable__errors.organization_not_found_or_unauthorized")));
						else card.setError(t(localizationKeys("unstable__errors.organization_not_found_or_unauthorized_with_create_organization_disabled")));
						break;
					default: handleError(err, [], card.setError);
				}
			}
		});
	};
	return /* @__PURE__ */ jsx(OrganizationPreviewButton, {
		elementDescriptor: descriptors.taskChooseOrganizationPreviewButton,
		onClick: () => handleOrganizationClicked(props.organization),
		children: /* @__PURE__ */ jsx(OrganizationPreview, {
			elementId: "taskChooseOrganization",
			mainIdentifierSx: sharedMainIdentifierSx,
			organization: props.organization
		})
	});
};
const InvitationPreview = (props) => {
	const card = useCardState();
	const { getOrganization } = useClerk();
	const [acceptedOrganization, setAcceptedOrganization] = useState(null);
	const { userInvitations } = useOrganizationList({ userInvitations: organizationListParams.userInvitations });
	const handleAccept = () => {
		return card.runAsync(async () => {
			return [await props.accept(), await getOrganization(props.publicOrganizationData.id)];
		}).then(([updatedItem, organization]) => {
			userInvitations?.setData?.((cachedPages) => populateCacheUpdateItem(updatedItem, cachedPages, "negative"));
			setAcceptedOrganization(organization);
		}).catch((err) => handleError(err, [], card.setError));
	};
	if (acceptedOrganization) return /* @__PURE__ */ jsx(MembershipPreview, { organization: acceptedOrganization });
	return /* @__PURE__ */ jsx(OrganizationPreviewListItem, {
		organizationData: props.publicOrganizationData,
		elementId: "taskChooseOrganization",
		elementDescriptor: descriptors.taskChooseOrganizationPreviewItem,
		children: /* @__PURE__ */ jsx(OrganizationPreviewListItemButton, {
			isLoading: card.isLoading,
			onClick: handleAccept,
			localizationKey: localizationKeys("taskChooseOrganization.chooseOrganization.action__invitationAccept")
		})
	});
};
const SuggestionPreview = withCardStateProvider((props) => {
	const card = useCardState();
	const { userSuggestions } = useOrganizationList({ userSuggestions: organizationListParams.userSuggestions });
	const handleAccept = () => {
		return card.runAsync(props.accept).then((updatedItem) => userSuggestions?.setData?.((pages) => populateCacheUpdateItem(updatedItem, pages))).catch((err) => handleError(err, [], card.setError));
	};
	return /* @__PURE__ */ jsx(OrganizationPreviewListItem, {
		organizationData: props.publicOrganizationData,
		elementId: "taskChooseOrganization",
		elementDescriptor: descriptors.taskChooseOrganizationPreviewItem,
		children: props.status === "accepted" ? /* @__PURE__ */ jsx(Text, {
			colorScheme: "secondary",
			localizationKey: localizationKeys("taskChooseOrganization.chooseOrganization.suggestionsAcceptedLabel")
		}) : /* @__PURE__ */ jsx(OrganizationPreviewListItemButton, {
			onClick: handleAccept,
			isLoading: card.isLoading,
			localizationKey: localizationKeys("taskChooseOrganization.chooseOrganization.action__suggestionsAccept")
		})
	});
});
const CreateOrganizationButton = ({ onCreateOrganizationClick }) => {
	return /* @__PURE__ */ jsx(CreateOrganizationAction, {
		elementDescriptor: descriptors.taskChooseOrganizationCreateOrganizationActionButton,
		label: localizationKeys("taskChooseOrganization.chooseOrganization.action__createOrganization"),
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

//#endregion
export { ChooseOrganizationScreen };
//# sourceMappingURL=ChooseOrganizationScreen.js.map