import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgUsers from "../../icons/users.js";
import { useProtect } from "../../common/Gate.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Box, Col, Flex, Icon, Text } from "../../customizables/index.js";
import { Alert } from "../../elements/Alert.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { NotificationCountBadge } from "../../common/NotificationCountBadge.js";
import { Animated } from "../../elements/Animated.js";
import { Action } from "../../elements/Action/index.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { useFetchRoles } from "../../hooks/useFetchRoles.js";
import { Tab, TabPanel, TabPanels, Tabs, TabsList } from "../../elements/Tabs.js";
import { ActiveMembersList } from "./ActiveMembersList.js";
import { MembersActionsRow } from "./MembersActions.js";
import { MembersSearch } from "./MembersSearch.js";
import { OrganizationMembersTabInvitations } from "./OrganizationMembersTabInvitations.js";
import { OrganizationMembersTabRequests } from "./OrganizationMembersTabRequests.js";
import { useState } from "react";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/OrganizationMembers.tsx
const ACTIVE_MEMBERS_PAGE_SIZE = 10;
const OrganizationMembers = withCardStateProvider(() => {
	const { organizationSettings } = useEnvironment();
	const card = useCardState();
	const { hasRoleSetMigration } = useFetchRoles();
	const canManageMemberships = useProtect({ permission: "org:sys_memberships:manage" });
	const canReadMemberships = useProtect({ permission: "org:sys_memberships:read" });
	const isDomainsEnabled = organizationSettings?.domains?.enabled && canManageMemberships;
	const [query, setQuery] = useState("");
	const [search, setSearch] = useState("");
	const { membershipRequests, memberships, invitations, organization } = useOrganization({
		membershipRequests: isDomainsEnabled || void 0,
		invitations: canManageMemberships || void 0,
		memberships: canReadMemberships ? {
			keepPreviousData: true,
			query: query || void 0
		} : void 0
	});
	if (canManageMemberships === null) return null;
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsxs(Col, {
		elementDescriptor: descriptors.page,
		gap: 2,
		sx: { isolation: "isolate" },
		children: [/* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.profilePage,
			elementId: descriptors.profilePage.setId("organizationMembers"),
			gap: 4,
			sx: (theme) => ({ paddingBottom: theme.space.$13 }),
			children: /* @__PURE__ */ jsxs(Action.Root, {
				animate: false,
				children: [
					/* @__PURE__ */ jsx(Animated, {
						asChild: true,
						children: /* @__PURE__ */ jsx(Header.Root, {
							contentSx: { [mqu.md]: {
								flexDirection: "row",
								width: "100%",
								justifyContent: "space-between"
							} },
							children: /* @__PURE__ */ jsx(Header.Title, {
								localizationKey: localizationKeys("organizationProfile.start.headerTitle__members"),
								textVariant: "h2"
							})
						})
					}),
					/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
					/* @__PURE__ */ jsxs(Tabs, { children: [/* @__PURE__ */ jsxs(TabsList, {
						sx: (t) => ({ gap: t.space.$2 }),
						children: [
							canReadMemberships && /* @__PURE__ */ jsx(Tab, {
								localizationKey: localizationKeys("organizationProfile.membersPage.start.headerTitle__members"),
								children: !!memberships?.count && /* @__PURE__ */ jsx(NotificationCountBadge, {
									shouldAnimate: !query,
									notificationCount: memberships.count,
									colorScheme: "outline"
								})
							}),
							canManageMemberships && /* @__PURE__ */ jsx(Tab, {
								localizationKey: localizationKeys("organizationProfile.membersPage.start.headerTitle__invitations"),
								children: invitations?.data && !invitations.isLoading && /* @__PURE__ */ jsx(NotificationCountBadge, {
									notificationCount: invitations.count,
									colorScheme: "outline"
								})
							}),
							canManageMemberships && isDomainsEnabled && /* @__PURE__ */ jsx(Tab, {
								localizationKey: localizationKeys("organizationProfile.membersPage.start.headerTitle__requests"),
								children: membershipRequests?.data && !membershipRequests.isLoading && /* @__PURE__ */ jsx(NotificationCountBadge, {
									notificationCount: membershipRequests.count,
									colorScheme: "outline"
								})
							})
						]
					}), /* @__PURE__ */ jsxs(TabPanels, { children: [
						canReadMemberships && /* @__PURE__ */ jsx(TabPanel, {
							sx: { width: "100%" },
							children: /* @__PURE__ */ jsx(Flex, {
								gap: 4,
								direction: "col",
								sx: { width: "100%" },
								children: /* @__PURE__ */ jsxs(Flex, {
									gap: 2,
									direction: "col",
									sx: { width: "100%" },
									children: [
										/* @__PURE__ */ jsx(MembersActionsRow, { actionSlot: /* @__PURE__ */ jsx(MembersSearch, {
											query,
											value: search,
											memberships,
											onSearchChange: (query) => setSearch(query),
											onQueryTrigger: (query) => setQuery(query)
										}) }),
										hasRoleSetMigration && /* @__PURE__ */ jsx(Alert, {
											variant: "warning",
											title: localizationKeys("organizationProfile.membersPage.alerts.roleSetMigrationInProgress.title"),
											subtitle: localizationKeys("organizationProfile.membersPage.alerts.roleSetMigrationInProgress.subtitle")
										}),
										/* @__PURE__ */ jsx(ActiveMembersList, {
											pageSize: 10,
											memberships
										})
									]
								})
							})
						}),
						canManageMemberships && /* @__PURE__ */ jsx(TabPanel, {
							sx: { width: "100%" },
							children: /* @__PURE__ */ jsx(OrganizationMembersTabInvitations, {})
						}),
						canManageMemberships && isDomainsEnabled && /* @__PURE__ */ jsx(TabPanel, {
							sx: { width: "100%" },
							children: /* @__PURE__ */ jsx(OrganizationMembersTabRequests, {})
						})
					] })] })
				]
			})
		}), canReadMemberships && !!memberships?.count && organization && organization.maxAllowedMemberships > 0 ? /* @__PURE__ */ jsx(Box, {
			sx: (theme) => ({
				position: "absolute",
				bottom: 0,
				insetInline: 0,
				backgroundColor: theme.colors.$colorBackground,
				borderTop: `1px solid ${theme.colors.$borderAlpha100}`,
				paddingInline: theme.space.$4,
				height: theme.space.$13,
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}),
			children: /* @__PURE__ */ jsxs(Text, {
				sx: (t) => ({
					display: "inline-flex",
					alignItems: "center",
					gap: t.space.$2
				}),
				children: [/* @__PURE__ */ jsx(Icon, {
					icon: SvgUsers,
					size: "md",
					colorScheme: "neutral"
				}), /* @__PURE__ */ jsx(Text, {
					as: "span",
					colorScheme: "inherit",
					localizationKey: localizationKeys("organizationProfile.start.membershipSeatUsageLabel", {
						count: organization.membersCount + organization.pendingInvitationsCount,
						limit: organization.maxAllowedMemberships
					})
				})]
			})
		}) : null]
	}) });
});

//#endregion
export { OrganizationMembers };
//# sourceMappingURL=OrganizationMembers.js.map