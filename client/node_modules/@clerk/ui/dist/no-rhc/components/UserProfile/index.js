import { USER_PROFILE_CARD_SCROLLBOX_ID } from "../../constants.js";
import { withCoreUserGuard } from "../../contexts/CoreUserContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { Route } from "../../router/Route.js";
import { Switch } from "../../router/Switch.js";
import { UserProfileContext } from "../../contexts/components/UserProfile.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { VerificationSuccessPage } from "./VerifyWithLink.js";
import { NavbarMenuButtonRow } from "../../elements/Navbar.js";
import { UserProfileNavbar } from "./UserProfileNavbar.js";
import { UserProfileRoutes } from "./UserProfileRoutes.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/index.tsx
const _UserProfile = () => {
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "userProfile",
		children: /* @__PURE__ */ jsx(Flow.Part, { children: /* @__PURE__ */ jsxs(Switch, { children: [/* @__PURE__ */ jsx(Route, {
			path: "verify",
			children: /* @__PURE__ */ jsx(VerificationSuccessPage, {})
		}), /* @__PURE__ */ jsx(Route, { children: /* @__PURE__ */ jsx(AuthenticatedRoutes, {}) })] }) })
	});
};
const AuthenticatedRoutes = withCoreUserGuard(() => {
	const contentRef = React.useRef(null);
	return /* @__PURE__ */ jsx(ProfileCard.Root, { children: /* @__PURE__ */ jsxs(UserProfileNavbar, {
		contentRef,
		children: [/* @__PURE__ */ jsx(NavbarMenuButtonRow, { navbarTitleLocalizationKey: localizationKeys("userProfile.navbar.title") }), /* @__PURE__ */ jsx(ProfileCard.Content, {
			contentRef,
			scrollBoxId: USER_PROFILE_CARD_SCROLLBOX_ID,
			children: /* @__PURE__ */ jsx(UserProfileRoutes, {})
		})]
	}) });
});
const UserProfile = withCardStateProvider(_UserProfile);
const InternalUserProfile = withCardStateProvider(_UserProfile);
const UserProfileModal = (props) => {
	const userProfileProps = {
		...props,
		routing: "virtual",
		componentName: "UserProfile",
		mode: "modal"
	};
	return /* @__PURE__ */ jsx(Route, {
		path: "user",
		children: /* @__PURE__ */ jsx(UserProfileContext.Provider, {
			value: userProfileProps,
			children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(InternalUserProfile, { ...userProfileProps }) })
		})
	});
};

//#endregion
export { UserProfile, UserProfileModal };
//# sourceMappingURL=index.js.map