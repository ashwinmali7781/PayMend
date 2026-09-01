import { USER_PROFILE_NAVBAR_ROUTE_ID } from "../../constants.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useUserProfileContext } from "../../contexts/components/UserProfile.js";
import { NavBar, NavbarContextProvider } from "../../elements/Navbar.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/UserProfileNavbar.tsx
const UserProfileNavbar = (props) => {
	const { pages, apiKeysProps } = useUserProfileContext();
	const routes = pages.routes.filter((r) => r.id !== USER_PROFILE_NAVBAR_ROUTE_ID.API_KEYS || !apiKeysProps?.hide);
	return /* @__PURE__ */ jsxs(NavbarContextProvider, {
		contentRef: props.contentRef,
		children: [/* @__PURE__ */ jsx(NavBar, {
			title: localizationKeys("userProfile.navbar.title"),
			description: localizationKeys("userProfile.navbar.description"),
			routes,
			contentRef: props.contentRef
		}), props.children]
	});
};

//#endregion
export { UserProfileNavbar };
//# sourceMappingURL=UserProfileNavbar.js.map