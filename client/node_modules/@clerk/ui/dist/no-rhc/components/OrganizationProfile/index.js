import { ORGANIZATION_PROFILE_CARD_SCROLLBOX_ID } from "../../constants.js";
import { withCoreUserGuard } from "../../contexts/CoreUserContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { Route } from "../../router/Route.js";
import { Switch } from "../../router/Switch.js";
import { SubscriberTypeContext } from "../../contexts/components/SubscriberType.js";
import { OrganizationProfileContext } from "../../contexts/components/OrganizationProfile.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { NavbarMenuButtonRow } from "../../elements/Navbar.js";
import { OrganizationProfileNavbar } from "./OrganizationProfileNavbar.js";
import { OrganizationProfileRoutes } from "./OrganizationProfileRoutes.js";
import React from "react";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/index.tsx
const OrganizationProfileInternal = () => {
	const { organization } = useOrganization();
	if (!organization) return null;
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "organizationProfile",
		children: /* @__PURE__ */ jsx(Flow.Part, { children: /* @__PURE__ */ jsx(Switch, { children: /* @__PURE__ */ jsx(Route, { children: /* @__PURE__ */ jsx(SubscriberTypeContext.Provider, {
			value: "organization",
			children: /* @__PURE__ */ jsx(AuthenticatedRoutes, {})
		}) }) }) })
	});
};
const AuthenticatedRoutes = withCoreUserGuard(() => {
	const contentRef = React.useRef(null);
	return /* @__PURE__ */ jsx(ProfileCard.Root, {
		sx: (t) => ({
			display: "grid",
			gridTemplateColumns: "1fr 3fr",
			height: t.sizes.$176,
			overflow: "hidden"
		}),
		children: /* @__PURE__ */ jsxs(OrganizationProfileNavbar, {
			contentRef,
			children: [/* @__PURE__ */ jsx(NavbarMenuButtonRow, { navbarTitleLocalizationKey: localizationKeys("organizationProfile.navbar.title") }), /* @__PURE__ */ jsx(ProfileCard.Content, {
				contentRef,
				scrollBoxId: ORGANIZATION_PROFILE_CARD_SCROLLBOX_ID,
				children: /* @__PURE__ */ jsx(OrganizationProfileRoutes, { contentRef })
			})]
		})
	});
});
const OrganizationProfile = withCardStateProvider(OrganizationProfileInternal);
const InternalOrganizationProfile = withCardStateProvider(OrganizationProfileInternal);
const OrganizationProfileModal = (props) => {
	const organizationProfileProps = {
		...props,
		routing: "virtual",
		componentName: "OrganizationProfile",
		mode: "modal"
	};
	return /* @__PURE__ */ jsx(Route, {
		path: "organizationProfile",
		children: /* @__PURE__ */ jsx(OrganizationProfileContext.Provider, {
			value: organizationProfileProps,
			children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(InternalOrganizationProfile, { ...organizationProfileProps }) })
		})
	});
};

//#endregion
export { OrganizationProfile, OrganizationProfileModal };
//# sourceMappingURL=index.js.map