import { localizationKeys } from "../../localization/localizationKeys.js";
import { Badge } from "../../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationProfile/EnrollmentBadge.tsx
const badgeLabelsMap = {
	manual_invitation: localizationKeys("organizationProfile.badge__manualInvitation"),
	automatic_invitation: localizationKeys("organizationProfile.badge__automaticInvitation"),
	automatic_suggestion: localizationKeys("organizationProfile.badge__automaticSuggestion"),
	enterprise_sso: localizationKeys("organizationProfile.badge__enterpriseSso")
};
const EnrollmentBadge = (props) => {
	const { organizationDomain } = props;
	if (!organizationDomain) return null;
	if (!(organizationDomain.ownershipVerification?.status === "verified" || organizationDomain.verification?.status === "verified")) return /* @__PURE__ */ jsx(Badge, {
		localizationKey: localizationKeys("organizationProfile.badge__unverified"),
		colorScheme: "warning"
	});
	return /* @__PURE__ */ jsx(Badge, {
		localizationKey: badgeLabelsMap[organizationDomain.enrollmentMode],
		colorScheme: organizationDomain.enrollmentMode === "manual_invitation" ? "primary" : "success"
	});
};

//#endregion
export { EnrollmentBadge };
//# sourceMappingURL=EnrollmentBadge.js.map