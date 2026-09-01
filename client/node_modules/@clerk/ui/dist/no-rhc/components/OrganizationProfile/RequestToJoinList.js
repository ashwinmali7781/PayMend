import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Box, Button, Flex, Td } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { DataTable, RowContainer } from "./MemberListTable.js";
import { UserPreview } from "../../elements/UserPreview.js";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/RequestToJoinList.tsx
const membershipRequestsParams = { membershipRequests: {
	pageSize: 10,
	keepPreviousData: true
} };
const RequestToJoinList = () => {
	const card = useCardState();
	const { organization, membershipRequests } = useOrganization(membershipRequestsParams);
	if (!organization) return null;
	return /* @__PURE__ */ jsx(DataTable, {
		page: membershipRequests?.page || 1,
		onPageChange: membershipRequests?.fetchPage ?? (() => null),
		itemCount: membershipRequests?.count || 0,
		pageCount: membershipRequests?.pageCount || 0,
		itemsPerPage: membershipRequestsParams.membershipRequests.pageSize,
		isLoading: membershipRequests?.isLoading,
		emptyStateLocalizationKey: localizationKeys("organizationProfile.membersPage.requestsTab.table__emptyRow"),
		headers: [
			{ key: localizationKeys("organizationProfile.membersPage.activeMembersTab.tableHeader__user") },
			{ key: localizationKeys("organizationProfile.membersPage.requestsTab.tableHeader__requested") },
			{
				key: localizationKeys("organizationProfile.membersPage.activeMembersTab.tableHeader__actions"),
				align: "right"
			}
		],
		rows: (membershipRequests?.data || []).map((request) => /* @__PURE__ */ jsx(RequestRow, {
			request,
			onError: card.setError
		}, request.id))
	});
};
const RequestRow = withCardStateProvider((props) => {
	const { request, onError } = props;
	const card = useCardState();
	const { membership, membershipRequests } = useOrganization(membershipRequestsParams);
	const onAccept = () => {
		if (!membership || !membershipRequests) return;
		return card.runAsync(async () => {
			await request.accept();
			await membershipRequests.revalidate();
		}, "accept").catch((err) => handleError(err, [], onError));
	};
	const onReject = () => {
		if (!membership || !membershipRequests) return;
		return card.runAsync(async () => {
			await request.reject();
			await membershipRequests.revalidate();
		}, "reject").catch((err) => handleError(err, [], onError));
	};
	return /* @__PURE__ */ jsxs(RowContainer, { children: [
		/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(UserPreview, {
			sx: { maxWidth: "30ch" },
			showAvatar: false,
			user: { primaryEmailAddress: { emailAddress: request.publicUserData.identifier } },
			subtitleProps: { variant: "caption" }
		}) }),
		/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Box, {
			as: "span",
			elementDescriptor: descriptors.formattedDate,
			elementId: descriptors.formattedDate.setId("tableCell"),
			children: request.createdAt.toLocaleDateString()
		}) }),
		/* @__PURE__ */ jsx(Td, {
			sx: { textAlign: "end" },
			children: /* @__PURE__ */ jsx(AcceptRejectRequestButtons, {
				onAccept,
				onReject
			})
		})
	] });
});
const AcceptRejectRequestButtons = (props) => {
	const card = useCardState();
	return /* @__PURE__ */ jsxs(Flex, {
		gap: 2,
		children: [/* @__PURE__ */ jsx(Button, {
			textVariant: "buttonSmall",
			variant: "ghost",
			isLoading: card.isLoading && card.loadingMetadata === "reject",
			isDisabled: card.isLoading && card.loadingMetadata !== "reject",
			onClick: props.onReject,
			localizationKey: localizationKeys("organizationProfile.membersPage.requestsTab.menuAction__reject")
		}), /* @__PURE__ */ jsx(Button, {
			textVariant: "buttonSmall",
			isLoading: card.isLoading && card.loadingMetadata === "accept",
			isDisabled: card.isLoading && card.loadingMetadata !== "accept",
			onClick: props.onAccept,
			localizationKey: localizationKeys("organizationProfile.membersPage.requestsTab.menuAction__approve")
		})]
	});
};

//#endregion
export { RequestToJoinList };
//# sourceMappingURL=RequestToJoinList.js.map