import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { Protect, useProtect } from "../../common/Gate.js";
import { Col, Text } from "../../customizables/index.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { ProfileSection } from "../../elements/Section.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { OrganizationPreview } from "../../elements/OrganizationPreview.js";
import { DeleteOrganizationForm, LeaveOrganizationForm } from "./ActionConfirmationPage.js";
import { AddDomainForm } from "./AddDomainForm.js";
import { DomainList } from "./DomainList.js";
import { ProfileForm } from "./ProfileForm.js";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/OrganizationGeneralPage.tsx
const ProfileScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(ProfileForm, {
		onSuccess: close,
		onReset: close
	});
};
const AddDomainScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(AddDomainForm, {
		onSuccess: close,
		onReset: close
	});
};
const LeaveOrganizationScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(LeaveOrganizationForm, {
		onSuccess: close,
		onReset: close
	});
};
const DeleteOrganizationScreen = () => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(DeleteOrganizationForm, {
		onSuccess: close,
		onReset: close
	});
};
const OrganizationGeneralPage = () => {
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsxs(ProfileCard.PagePanel, {
		pageId: "organizationGeneral",
		titleKey: localizationKeys("organizationProfile.start.headerTitle__general"),
		children: [
			/* @__PURE__ */ jsx(OrganizationProfileSection, {}),
			/* @__PURE__ */ jsx(Protect, {
				permission: "org:sys_domains:read",
				children: /* @__PURE__ */ jsx(OrganizationDomainsSection, {})
			}),
			/* @__PURE__ */ jsx(OrganizationLeaveSection, {}),
			/* @__PURE__ */ jsx(OrganizationDeleteSection, {})
		]
	}) });
};
/**
* Renders the organization profile section (name, logo) with inline edit when the user has
* `org:sys_profile:manage`.
*
* @returns The profile section, or `null` when no organization is active.
*/
const OrganizationProfileSection = () => {
	const { organization } = useOrganization();
	if (!organization) return null;
	const profile = /* @__PURE__ */ jsx(OrganizationPreview, {
		size: "lg",
		mainIdentifierVariant: "subtitle",
		organization
	});
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		title: localizationKeys("organizationProfile.start.profileSection.title"),
		id: "organizationProfile",
		children: /* @__PURE__ */ jsxs(Action.Root, { children: [/* @__PURE__ */ jsx(Protect, {
			permission: "org:sys_profile:manage",
			fallback: profile,
			children: /* @__PURE__ */ jsx(Action.Closed, {
				value: "edit",
				children: /* @__PURE__ */ jsxs(ProfileSection.Item, {
					id: "organizationProfile",
					children: [profile, /* @__PURE__ */ jsx(Action.Trigger, {
						value: "edit",
						children: /* @__PURE__ */ jsx(ProfileSection.Button, {
							id: "organizationProfile",
							localizationKey: localizationKeys("organizationProfile.start.profileSection.primaryButton")
						})
					})]
				})
			})
		}), /* @__PURE__ */ jsx(Action.Open, {
			value: "edit",
			children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(ProfileScreen, {}) })
		})] })
	});
};
/**
* Renders the verified-domains section.
*
* @returns The domains section, or `null` when domains are disabled, no organization is active, or
* there are no domains and the user cannot add any.
*/
const OrganizationDomainsSection = () => {
	const { organizationSettings } = useEnvironment();
	const { organization, domains } = useOrganization({ domains: { infinite: true } });
	const canManageDomains = useProtect({ permission: "org:sys_domains:manage" });
	if (!organizationSettings || !organization) return null;
	if (!organizationSettings.domains.enabled) return null;
	if (!domains?.data?.length && !canManageDomains) return null;
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		title: localizationKeys("organizationProfile.profilePage.domainSection.title"),
		id: "organizationDomains",
		centered: false,
		children: /* @__PURE__ */ jsxs(Action.Root, { children: [/* @__PURE__ */ jsx(DomainList, {}), /* @__PURE__ */ jsxs(Protect, {
			permission: "org:sys_domains:manage",
			children: [/* @__PURE__ */ jsx(Action.Trigger, {
				value: "add",
				children: /* @__PURE__ */ jsxs(Col, { children: [/* @__PURE__ */ jsx(ProfileSection.ArrowButton, {
					localizationKey: localizationKeys("organizationProfile.profilePage.domainSection.primaryButton"),
					id: "organizationDomains"
				}), /* @__PURE__ */ jsx(Text, {
					localizationKey: localizationKeys("organizationProfile.profilePage.domainSection.subtitle"),
					sx: (t) => ({ paddingInlineStart: t.space.$8x5 }),
					colorScheme: "secondary"
				})] })
			}), /* @__PURE__ */ jsx(Action.Open, {
				value: "add",
				children: /* @__PURE__ */ jsx(Action.Card, { children: /* @__PURE__ */ jsx(AddDomainScreen, {}) })
			})]
		})] })
	});
};
/**
* Renders the "leave organization" action in the danger section.
*
* @returns The leave-organization section, or `null` when no organization is active.
*/
const OrganizationLeaveSection = () => {
	const { organization } = useOrganization();
	if (!organization) return null;
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		id: "organizationDanger",
		title: localizationKeys("organizationProfile.profilePage.dangerSection.leaveOrganization.title"),
		children: /* @__PURE__ */ jsxs(Action.Root, { children: [/* @__PURE__ */ jsx(Action.Closed, {
			value: "leave",
			children: /* @__PURE__ */ jsx(ProfileSection.Item, {
				sx: (t) => ({
					paddingTop: 0,
					paddingBottom: 0,
					paddingInlineStart: t.space.$1
				}),
				id: "organizationDanger",
				children: /* @__PURE__ */ jsx(Action.Trigger, {
					value: "leave",
					children: /* @__PURE__ */ jsx(ProfileSection.Button, {
						id: "organizationDanger",
						variant: "ghost",
						colorScheme: "danger",
						textVariant: "buttonLarge",
						localizationKey: localizationKeys("organizationProfile.profilePage.dangerSection.leaveOrganization.title")
					})
				})
			})
		}), /* @__PURE__ */ jsx(Action.Open, {
			value: "leave",
			children: /* @__PURE__ */ jsx(Action.Card, {
				variant: "destructive",
				children: /* @__PURE__ */ jsx(LeaveOrganizationScreen, {})
			})
		})] })
	});
};
/**
* Renders the "delete organization" action in the danger section.
*
* @returns The delete-organization section, or `null` when no organization is active, the user
* lacks `org:sys_profile:delete`, or admin delete is disabled.
*/
const OrganizationDeleteSection = () => {
	const { organization } = useOrganization();
	const canDeleteOrganization = useProtect({ permission: "org:sys_profile:delete" });
	if (!organization) return null;
	const adminDeleteEnabled = organization.adminDeleteEnabled;
	if (!canDeleteOrganization || !adminDeleteEnabled) return null;
	return /* @__PURE__ */ jsx(ProfileSection.Root, {
		id: "organizationDanger",
		title: localizationKeys("organizationProfile.profilePage.dangerSection.deleteOrganization.title"),
		sx: (t) => ({ marginBottom: t.space.$4 }),
		children: /* @__PURE__ */ jsxs(Action.Root, { children: [/* @__PURE__ */ jsx(Action.Closed, {
			value: "delete",
			children: /* @__PURE__ */ jsx(ProfileSection.Item, {
				sx: (t) => ({
					paddingTop: 0,
					paddingBottom: 0,
					paddingInlineStart: t.space.$1
				}),
				id: "organizationDanger",
				children: /* @__PURE__ */ jsx(Action.Trigger, {
					value: "delete",
					children: /* @__PURE__ */ jsx(ProfileSection.Button, {
						id: "organizationDanger",
						variant: "ghost",
						colorScheme: "danger",
						textVariant: "buttonLarge",
						localizationKey: localizationKeys("organizationProfile.profilePage.dangerSection.deleteOrganization.title")
					})
				})
			})
		}), /* @__PURE__ */ jsx(Action.Open, {
			value: "delete",
			children: /* @__PURE__ */ jsx(Action.Card, {
				variant: "destructive",
				children: /* @__PURE__ */ jsx(DeleteOrganizationScreen, {})
			})
		})] })
	});
};

//#endregion
export { OrganizationDeleteSection, OrganizationDomainsSection, OrganizationGeneralPage, OrganizationLeaveSection, OrganizationProfileSection };
//# sourceMappingURL=OrganizationGeneralPage.js.map