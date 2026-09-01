import { organizationListParams } from "./OrganizationSwitcher/utils.js";
import { useOrganizationList } from "@clerk/shared/react";

//#region src/components/prefetch-organization-list.tsx
function OrganizationSwitcherPrefetch() {
	useOrganizationList(organizationListParams);
	return null;
}

//#endregion
export { OrganizationSwitcherPrefetch };
//# sourceMappingURL=prefetch-organization-list.js.map