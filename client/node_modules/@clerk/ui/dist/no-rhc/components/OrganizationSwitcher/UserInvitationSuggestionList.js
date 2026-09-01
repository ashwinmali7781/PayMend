import { useInView } from "../../hooks/useInView.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgArrowRight from "../../icons/arrow-right.js";
import { useAcceptedInvitations } from "../../contexts/AcceptedUserInvitations.js";
import { common } from "../../styledSystem/common.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Box, Button, Flex, Text } from "../../customizables/index.js";
import { InfiniteListSpinner } from "../../common/InfiniteListSpinner.js";
import { handleError } from "../../utils/errorHandler.js";
import { organizationListParams, populateCacheUpdateItem } from "./utils.js";
import { Actions } from "../../elements/Actions.js";
import { OrganizationPreview } from "../../elements/OrganizationPreview.js";
import { PreviewButton } from "../../elements/PreviewButton.js";
import { useClerk, useOrganization, useOrganizationList } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationSwitcher/UserInvitationSuggestionList.tsx
const useFetchInvitations = () => {
	const { userInvitations, userSuggestions } = useOrganizationList(organizationListParams);
	const { ref } = useInView({
		threshold: 0,
		onChange: (inView) => {
			if (!inView) return;
			if (userInvitations.hasNextPage) userInvitations.fetchNext?.();
			else userSuggestions.fetchNext?.();
		}
	});
	return {
		userInvitations,
		userSuggestions,
		ref
	};
};
const AcceptRejectSuggestionButtons = (props) => {
	const card = useCardState();
	const { userSuggestions } = useOrganizationList({ userSuggestions: organizationListParams.userSuggestions });
	const handleAccept = () => {
		return card.runAsync(props.accept).then((updatedItem) => userSuggestions?.setData?.((pages) => populateCacheUpdateItem(updatedItem, pages))).catch((err) => handleError(err, [], card.setError));
	};
	if (props.status === "accepted") return /* @__PURE__ */ jsx(Text, {
		colorScheme: "secondary",
		localizationKey: localizationKeys("organizationSwitcher.suggestionsAcceptedLabel")
	});
	return /* @__PURE__ */ jsx(Button, {
		elementDescriptor: descriptors.organizationSwitcherInvitationAcceptButton,
		textVariant: "buttonSmall",
		variant: "outline",
		colorScheme: "neutral",
		size: "sm",
		isLoading: card.isLoading,
		onClick: handleAccept,
		localizationKey: localizationKeys("organizationSwitcher.action__suggestionsAccept")
	});
};
const AcceptRejectInvitationButtons = (props) => {
	const card = useCardState();
	return /* @__PURE__ */ jsx(Button, {
		elementDescriptor: descriptors.organizationSwitcherInvitationAcceptButton,
		textVariant: "buttonSmall",
		variant: "outline",
		colorScheme: "neutral",
		size: "xs",
		isLoading: card.isLoading,
		onClick: props.onAccept,
		localizationKey: localizationKeys("organizationSwitcher.action__invitationAccept")
	});
};
const Preview = (props) => {
	const { children, publicOrganizationData } = props;
	return /* @__PURE__ */ jsxs(Flex, {
		align: "center",
		gap: 2,
		sx: (t) => ({
			justifyContent: "space-between",
			padding: `${t.space.$4} ${t.space.$5}`
		}),
		elementDescriptor: descriptors.organizationSwitcherPopoverInvitationActionsBox,
		children: [/* @__PURE__ */ jsx(OrganizationPreview, {
			elementId: "organizationSwitcherListedOrganization",
			organization: publicOrganizationData,
			sx: (t) => ({
				color: t.colors.$colorMutedForeground,
				":hover": { color: t.colors.$colorMutedForeground }
			})
		}), children]
	});
};
const InvitationPreview = withCardStateProvider((props) => {
	const { invitation, onOrganizationClick } = props;
	const { accept, publicOrganizationData, status } = invitation;
	const card = useCardState();
	const { getOrganization } = useClerk();
	const { organization: activeOrganization } = useOrganization();
	const { userInvitations } = useOrganizationList({
		userInvitations: organizationListParams.userInvitations,
		userMemberships: organizationListParams.userMemberships
	});
	const { acceptedInvitations, setAcceptedInvitations } = useAcceptedInvitations();
	const acceptedOrganization = acceptedInvitations.find((item) => item.invitation.id === invitation.id)?.organization;
	const handleAccept = () => {
		return card.runAsync(async () => {
			return [await accept(), await getOrganization(publicOrganizationData.id)];
		}).then(([updatedItem, organization]) => {
			userInvitations?.setData?.((cachedPages) => populateCacheUpdateItem(updatedItem, cachedPages, "negative"));
			setAcceptedInvitations((old) => [...old, {
				organization,
				invitation: updatedItem
			}]);
		}).catch((err) => handleError(err, [], card.setError));
	};
	if (status === "accepted") {
		if (invitation.publicOrganizationData.id === activeOrganization?.id || acceptedOrganization?.id && activeOrganization?.id === acceptedOrganization.id) return null;
		return /* @__PURE__ */ jsx(PreviewButton, {
			elementDescriptor: descriptors.organizationSwitcherPreviewButton,
			icon: SvgArrowRight,
			onClick: acceptedOrganization ? () => onOrganizationClick(acceptedOrganization) : void 0,
			children: /* @__PURE__ */ jsx(OrganizationPreview, {
				elementId: "organizationSwitcherListedOrganization",
				organization: publicOrganizationData,
				sx: (t) => ({
					color: t.colors.$colorMutedForeground,
					":hover": { color: t.colors.$colorMutedForeground }
				})
			})
		});
	}
	return /* @__PURE__ */ jsx(Preview, {
		publicOrganizationData,
		children: /* @__PURE__ */ jsx(AcceptRejectInvitationButtons, { onAccept: handleAccept })
	});
});
const SwitcherInvitationActions = (props) => {
	const { showBorder, ...restProps } = props;
	return /* @__PURE__ */ jsx(Actions, { ...restProps });
};
const SuggestionPreview = withCardStateProvider((props) => {
	return /* @__PURE__ */ jsx(Preview, {
		publicOrganizationData: props.publicOrganizationData,
		children: /* @__PURE__ */ jsx(AcceptRejectSuggestionButtons, { ...props })
	});
});
const UserInvitationSuggestionList = (props) => {
	const { onOrganizationClick } = props;
	const { ref, userSuggestions, userInvitations } = useFetchInvitations();
	const isLoading = userInvitations.isLoading || userSuggestions.isLoading;
	const hasNextPage = userInvitations.hasNextPage || userSuggestions.hasNextPage;
	const userInvitationsData = userInvitations.data?.filter((a) => !!a) || [];
	const userSuggestionsData = userSuggestions.data?.filter((a) => !!a) || [];
	const hasAnyData = userInvitationsData.length > 0 || userSuggestionsData.length > 0;
	if (!hasAnyData && !isLoading) return null;
	return /* @__PURE__ */ jsx(SwitcherInvitationActions, {
		showBorder: hasAnyData || isLoading,
		elementDescriptor: descriptors.organizationSwitcherPopoverInvitationActions,
		children: /* @__PURE__ */ jsxs(Box, {
			sx: (t) => ({
				maxHeight: `calc(4 * ${t.sizes.$17} + 4px)`,
				overflowY: "auto",
				...common.unstyledScrollbar(t)
			}),
			children: [
				userInvitationsData?.map((inv) => {
					return /* @__PURE__ */ jsx(InvitationPreview, {
						invitation: inv,
						onOrganizationClick
					}, inv.id);
				}),
				!userInvitations.hasNextPage && userSuggestionsData?.map((suggestion) => {
					return /* @__PURE__ */ jsx(SuggestionPreview, { ...suggestion }, suggestion.id);
				}),
				(hasNextPage || isLoading) && /* @__PURE__ */ jsx(InfiniteListSpinner, { ref })
			]
		})
	});
};

//#endregion
export { UserInvitationSuggestionList };
//# sourceMappingURL=UserInvitationSuggestionList.js.map