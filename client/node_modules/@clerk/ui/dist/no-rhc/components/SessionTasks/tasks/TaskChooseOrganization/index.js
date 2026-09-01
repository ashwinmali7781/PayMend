import { localizationKeys } from "../../../../localization/localizationKeys.js";
import { useSignOutContext } from "../../../../contexts/components/SignOut.js";
import { useSessionTasksContext, useTaskChooseOrganizationContext } from "../../../../contexts/components/SessionTasks.js";
import { withCoreSessionSwitchGuard } from "../../../../contexts/CoreSessionContext.js";
import { descriptors } from "../../../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../../../elements/contexts/index.js";
import { Flow } from "../../../../customizables/Flow.js";
import { Flex, Spinner } from "../../../../customizables/index.js";
import { Card } from "../../../../elements/Card/index.js";
import { Header } from "../../../../elements/Header.js";
import { handleError } from "../../../../utils/errorHandler.js";
import { useMultipleSessions } from "../../../../hooks/useMultipleSessions.js";
import { useOrganizationListInView } from "../../../../hooks/useOrganizationListInView.js";
import { withTaskGuard } from "../shared/withTaskGuard.js";
import { ChooseOrganizationScreen } from "./ChooseOrganizationScreen.js";
import { CreateOrganizationScreen } from "./CreateOrganizationScreen.js";
import { useEffect, useRef, useState } from "react";
import { useClerk, useOrganizationCreationDefaults, useOrganizationList, useSession, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskChooseOrganization/index.tsx
const LoadingCardContent = () => /* @__PURE__ */ jsx(Flex, {
	direction: "row",
	align: "center",
	justify: "center",
	sx: (t) => ({
		height: "100%",
		minHeight: t.sizes.$100
	}),
	children: /* @__PURE__ */ jsx(Spinner, {
		size: "lg",
		colorScheme: "primary",
		elementDescriptor: descriptors.spinner
	})
});
const TaskChooseOrganizationInternal = () => {
	const card = useCardState();
	const { user } = useUser();
	const { userMemberships, userSuggestions, userInvitations } = useOrganizationListInView();
	const organizationCreationDefaults = useOrganizationCreationDefaults();
	const { isLoaded: isOrganizationListLoaded, setActive } = useOrganizationList();
	const { navigateOnSetActive } = useSessionTasksContext();
	const { redirectUrlComplete } = useTaskChooseOrganizationContext();
	const exclusiveOrganization = user?.organizationMemberships?.find((membership) => membership.organization.exclusiveMembership === true)?.organization;
	const hasAutoActivated = useRef(false);
	const [autoActivateFailed, setAutoActivateFailed] = useState(false);
	const shouldAutoActivate = !!exclusiveOrganization && !autoActivateFailed;
	useEffect(() => {
		if (!exclusiveOrganization || autoActivateFailed || !isOrganizationListLoaded || hasAutoActivated.current) return;
		hasAutoActivated.current = true;
		(async () => {
			try {
				await setActive({
					organization: exclusiveOrganization,
					navigate: async ({ session, decorateUrl }) => {
						await navigateOnSetActive?.({
							session,
							redirectUrlComplete,
							decorateUrl
						});
					}
				});
			} catch (err) {
				handleError(err, [], card.setError);
				setAutoActivateFailed(true);
			}
		})();
	}, [
		exclusiveOrganization,
		autoActivateFailed,
		isOrganizationListLoaded
	]);
	const isLoading = userMemberships?.isLoading || userInvitations?.isLoading || userSuggestions?.isLoading || organizationCreationDefaults?.isLoading;
	const hasExistingResources = !!(userMemberships?.count || userInvitations?.count || userSuggestions?.count);
	if (!isLoading && !user?.createOrganizationEnabled && user?.organizationMemberships?.length === 0 && !hasExistingResources && !shouldAutoActivate) return /* @__PURE__ */ jsx(OrganizationCreationDisabledScreen, {});
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "taskChooseOrganization",
		children: /* @__PURE__ */ jsx(Flow.Part, {
			part: "chooseOrganization",
			children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsx(Card.Content, {
				sx: (t) => ({
					padding: `${t.space.$8} ${t.space.$none} ${t.space.$none}`,
					gap: t.space.$7
				}),
				children: shouldAutoActivate || isLoading ? /* @__PURE__ */ jsx(LoadingCardContent, {}) : /* @__PURE__ */ jsx(TaskChooseOrganizationFlows, {
					initialFlow: hasExistingResources ? "choose" : "create",
					organizationCreationDefaults: organizationCreationDefaults.data
				})
			}), /* @__PURE__ */ jsx(TaskChooseOrganizationCardFooter, {})] })
		})
	});
};
const TaskChooseOrganizationCardFooter = () => {
	const { signOut } = useClerk();
	const { user } = useUser();
	const { session } = useSession();
	const { otherSessions } = useMultipleSessions({ user });
	const { navigateAfterSignOut, navigateAfterMultiSessionSingleSignOutUrl } = useSignOutContext();
	const handleSignOut = () => {
		if (otherSessions.length === 0) return signOut(navigateAfterSignOut);
		return signOut(navigateAfterMultiSessionSingleSignOutUrl, { sessionId: session?.id });
	};
	const identifier = user?.primaryEmailAddress?.emailAddress ?? user?.username;
	return /* @__PURE__ */ jsx(Card.Footer, { children: /* @__PURE__ */ jsxs(Card.Action, {
		elementId: "signOut",
		gap: 2,
		justify: "center",
		sx: () => ({ width: "100%" }),
		children: [identifier && /* @__PURE__ */ jsx(Card.ActionText, {
			truncate: true,
			localizationKey: localizationKeys("taskChooseOrganization.signOut.actionText", { identifier })
		}), /* @__PURE__ */ jsx(Card.ActionLink, {
			sx: () => ({ flexShrink: 0 }),
			onClick: handleSignOut,
			localizationKey: localizationKeys("taskChooseOrganization.signOut.actionLink")
		})]
	}) });
};
const TaskChooseOrganizationFlows = withCardStateProvider((props) => {
	const [currentFlow, setCurrentFlow] = useState(props.initialFlow);
	if (currentFlow === "create") return /* @__PURE__ */ jsx(CreateOrganizationScreen, {
		onCancel: props.initialFlow === "choose" ? () => setCurrentFlow("choose") : void 0,
		organizationCreationDefaults: props.organizationCreationDefaults
	});
	return /* @__PURE__ */ jsx(ChooseOrganizationScreen, { onCreateOrganizationClick: () => setCurrentFlow("create") });
});
function OrganizationCreationDisabledScreen() {
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "taskChooseOrganization",
		children: /* @__PURE__ */ jsx(Flow.Part, {
			part: "organizationCreationDisabled",
			children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsx(Card.Content, { children: /* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("taskChooseOrganization.organizationCreationDisabled.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("taskChooseOrganization.organizationCreationDisabled.subtitle") })]
			}) }), /* @__PURE__ */ jsx(TaskChooseOrganizationCardFooter, {})] })
		})
	});
}
const TaskChooseOrganization = withCoreSessionSwitchGuard(withTaskGuard(withCardStateProvider(TaskChooseOrganizationInternal), "choose-organization"));

//#endregion
export { TaskChooseOrganization };
//# sourceMappingURL=index.js.map