import { localizationKeys } from "../../../../localization/localizationKeys.js";
import { Alert, Text } from "../../../../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SessionTasks/tasks/TaskChooseOrganization/OrganizationCreationDefaultsAlert.tsx
function OrganizationCreationDefaultsAlert({ organizationCreationDefaults }) {
	const localizationKey = advisoryToLocalizationKey(organizationCreationDefaults?.advisory);
	if (!localizationKey) return null;
	return /* @__PURE__ */ jsx(Alert, {
		colorScheme: "warning",
		children: /* @__PURE__ */ jsx(Text, {
			colorScheme: "warning",
			localizationKey,
			variant: "caption"
		})
	});
}
const advisoryToLocalizationKey = (advisory) => {
	if (!advisory) return null;
	switch (advisory.code) {
		case "organization_already_exists": return localizationKeys("taskChooseOrganization.alerts.organizationAlreadyExists", {
			organizationDomain: advisory.meta.organization_domain,
			organizationName: advisory.meta.organization_name
		});
		default: return null;
	}
};

//#endregion
export { OrganizationCreationDefaultsAlert };
//# sourceMappingURL=OrganizationCreationDefaultsAlert.js.map