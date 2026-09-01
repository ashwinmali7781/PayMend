import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Text } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { populateCacheUpdateItem } from "../OrganizationSwitcher/utils.js";
import { PreviewListItem, PreviewListItemButton } from "./shared.js";
import { organizationListParams } from "./utils.js";
import { useOrganizationList } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationList/UserSuggestionList.tsx
const AcceptRejectInvitationButtons = (props) => {
	const card = useCardState();
	const { userSuggestions } = useOrganizationList({ userSuggestions: organizationListParams.userSuggestions });
	const handleAccept = () => {
		return card.runAsync(props.accept).then((updatedItem) => userSuggestions?.setData?.((pages) => populateCacheUpdateItem(updatedItem, pages))).catch((err) => handleError(err, [], card.setError));
	};
	if (props.status === "accepted") return /* @__PURE__ */ jsx(Text, {
		colorScheme: "secondary",
		localizationKey: localizationKeys("organizationList.suggestionsAcceptedLabel")
	});
	return /* @__PURE__ */ jsx(PreviewListItemButton, {
		isLoading: card.isLoading,
		onClick: handleAccept,
		localizationKey: localizationKeys("organizationList.action__suggestionsAccept")
	});
};
const SuggestionPreview = withCardStateProvider((props) => {
	return /* @__PURE__ */ jsx(PreviewListItem, {
		organizationData: props.publicOrganizationData,
		children: /* @__PURE__ */ jsx(AcceptRejectInvitationButtons, { ...props })
	});
});

//#endregion
export { SuggestionPreview };
//# sourceMappingURL=UserSuggestionList.js.map