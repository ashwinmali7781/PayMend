import { useInView } from "../../hooks/useInView.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { Protect, withProtect } from "../../common/Gate.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Flex, Spinner, Text } from "../../customizables/index.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { ThreeDotsMenu } from "../../elements/ThreeDotsMenu.js";
import { ProfileSection } from "../../elements/Section.js";
import { EnrollmentBadge } from "./EnrollmentBadge.js";
import { RemoveDomainScreen } from "./RemoveDomainScreen.js";
import { VerifiedDomainScreen } from "./VerifiedDomainScreen.js";
import { VerifyDomainScreen } from "./VerifyDomainScreen.js";
import React, { useMemo } from "react";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/DomainList.tsx
const useMenuActions = (domain) => {
	const { open } = useActionContext();
	const menuActions = [];
	if (domain.verification && domain.verification.status === "verified") menuActions.push({
		label: localizationKeys("organizationProfile.profilePage.domainSection.menuAction__manage"),
		onClick: () => open("manage")
	});
	else menuActions.push({
		label: localizationKeys("organizationProfile.profilePage.domainSection.menuAction__verify"),
		onClick: () => open("verify")
	});
	menuActions.push({
		label: localizationKeys("organizationProfile.profilePage.domainSection.menuAction__remove"),
		isDestructive: true,
		onClick: () => open("remove")
	});
	return menuActions;
};
const DomainListMenu = ({ domain }) => {
	return /* @__PURE__ */ jsx(ThreeDotsMenu, { actions: useMenuActions(domain) });
};
const DomainList = withProtect((props) => {
	const { verificationStatus, enrollmentMode, fallback, ...rest } = props;
	const { organization, domains } = useOrganization({ domains: {
		infinite: true,
		...rest
	} });
	const { ref } = useInView({
		threshold: 0,
		onChange: (inView) => {
			if (inView) domains?.fetchNext?.();
		}
	});
	const domainList = useMemo(() => {
		if (!domains?.data) return [];
		return domains.data.filter((d) => {
			let matchesStatus = true;
			let matchesMode = true;
			if (verificationStatus) matchesStatus = !!d.verification && d.verification.status === verificationStatus;
			if (enrollmentMode) matchesMode = d.enrollmentMode === enrollmentMode;
			return matchesStatus && matchesMode;
		});
	}, [domains?.data]);
	if (!organization) return null;
	const hasNextOrFetching = domains?.hasNextPage || domains?.isFetching;
	if (domainList.length === 0 && !domains?.isLoading && !fallback) return null;
	return /* @__PURE__ */ jsxs(ProfileSection.ItemList, {
		id: "organizationDomains",
		children: [
			domainList.length === 0 && !domains?.isLoading && fallback,
			domainList.map((domain) => {
				return /* @__PURE__ */ jsxs(Action.Root, { children: [
					/* @__PURE__ */ jsxs(ProfileSection.Item, {
						id: "organizationDomains",
						hoverable: true,
						children: [/* @__PURE__ */ jsxs(Flex, {
							sx: (t) => ({ gap: t.space.$1 }),
							children: [/* @__PURE__ */ jsx(Text, { children: domain.name }), /* @__PURE__ */ jsx(EnrollmentBadge, { organizationDomain: domain })]
						}), /* @__PURE__ */ jsx(Protect, {
							permission: "org:sys_domains:manage",
							children: /* @__PURE__ */ jsx(DomainListMenu, { domain })
						})]
					}),
					/* @__PURE__ */ jsx(Action.Open, {
						value: "remove",
						children: /* @__PURE__ */ jsx(Action.Card, {
							variant: "destructive",
							children: /* @__PURE__ */ jsx(RemoveDomainScreen, { domainId: domain.id })
						})
					}),
					/* @__PURE__ */ jsx(Action.Open, {
						value: "verify",
						children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(VerifyDomainScreen, { domainId: domain.id }) })
					}),
					/* @__PURE__ */ jsx(Action.Open, {
						value: "manage",
						children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(VerifiedDomainScreen, { domainId: domain.id }) })
					})
				] }, domain.id);
			}),
			/* @__PURE__ */ jsx(Box, {
				ref: domains?.hasNextPage && !domains.isFetching ? ref : void 0,
				sx: { visibility: "hidden" }
			}),
			hasNextOrFetching && domains.data.length === 0 && /* @__PURE__ */ jsx(Box, {
				sx: [(t) => ({
					width: "100%",
					height: t.space.$8,
					position: "relative"
				})],
				children: /* @__PURE__ */ jsx(Box, {
					sx: {
						display: "flex",
						margin: "auto",
						position: "absolute",
						left: "50%",
						top: "50%",
						transform: "translateY(-50%) translateX(-50%)"
					},
					children: /* @__PURE__ */ jsx(Spinner, {
						size: "sm",
						colorScheme: "primary",
						elementDescriptor: descriptors.spinner
					})
				})
			})
		]
	});
}, { permission: "org:sys_domains:read" });

//#endregion
export { DomainList };
//# sourceMappingURL=DomainList.js.map