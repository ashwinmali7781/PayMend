import { APIKeysContext } from "../../contexts/components/APIKeys.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useUserProfileContext } from "../../contexts/components/UserProfile.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Col } from "../../customizables/index.js";
import { Header } from "../../elements/Header.js";
import { APIKeysPage as APIKeysPage$1 } from "../APIKeys/APIKeys.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { useUnsafeNavbarContext } from "../../elements/Navbar.js";
import { useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/APIKeysPage.tsx
const APIKeysPage = () => {
	const { user } = useUser();
	const { contentRef } = useUnsafeNavbarContext();
	const { apiKeysProps } = useUserProfileContext();
	if (!user) return null;
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsxs(Col, {
		gap: 4,
		elementDescriptor: descriptors.page,
		sx: { isolation: "isolate" },
		children: [/* @__PURE__ */ jsx(Header.Root, { children: /* @__PURE__ */ jsx(Header.Title, {
			localizationKey: localizationKeys("userProfile.apiKeysPage.title"),
			textVariant: "h2"
		}) }), /* @__PURE__ */ jsx(APIKeysContext.Provider, {
			value: {
				componentName: "APIKeys",
				...apiKeysProps
			},
			children: /* @__PURE__ */ jsx(APIKeysPage$1, {
				subject: user.id,
				revokeModalRoot: contentRef
			})
		})]
	}) });
};

//#endregion
export { APIKeysPage };
//# sourceMappingURL=APIKeysPage.js.map