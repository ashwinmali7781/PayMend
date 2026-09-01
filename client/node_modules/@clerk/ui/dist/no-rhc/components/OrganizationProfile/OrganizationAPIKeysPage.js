import { APIKeysContext } from "../../contexts/components/APIKeys.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useOrganizationProfileContext } from "../../contexts/components/OrganizationProfile.js";
import { Col } from "../../customizables/index.js";
import { Header } from "../../elements/Header.js";
import { APIKeysPage } from "../APIKeys/APIKeys.js";
import { ProfileCard } from "../../elements/ProfileCard/index.js";
import { useUnsafeNavbarContext } from "../../elements/Navbar.js";
import { useOrganization } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/OrganizationAPIKeysPage.tsx
const OrganizationAPIKeysPage = () => {
	const { organization } = useOrganization();
	const { contentRef } = useUnsafeNavbarContext();
	const { apiKeysProps } = useOrganizationProfileContext();
	if (!organization) return null;
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsxs(Col, {
		gap: 4,
		children: [/* @__PURE__ */ jsx(Header.Root, { children: /* @__PURE__ */ jsx(Header.Title, {
			localizationKey: localizationKeys("organizationProfile.apiKeysPage.title"),
			textVariant: "h2"
		}) }), /* @__PURE__ */ jsx(APIKeysContext.Provider, {
			value: {
				...apiKeysProps,
				componentName: "APIKeys"
			},
			children: /* @__PURE__ */ jsx(APIKeysPage, {
				subject: organization.id,
				revokeModalRoot: contentRef
			})
		})]
	}) });
};

//#endregion
export { OrganizationAPIKeysPage };
//# sourceMappingURL=OrganizationAPIKeysPage.js.map