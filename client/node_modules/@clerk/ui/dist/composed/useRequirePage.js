import { isDevelopmentSDK } from "../utils/runtimeEnvironment.js";
import { PageContext } from "./PageContext.js";
import { useContext } from "react";
import { useClerk } from "@clerk/shared/react";

//#region src/composed/useRequirePage.ts
function useRequirePage(componentName) {
	const clerk = useClerk();
	if (!useContext(PageContext)) {
		if (isDevelopmentSDK(clerk)) throw new Error(`<${componentName}> must be rendered inside a page component (e.g. <UserProfileAccountPanel>, <UserProfileSecurityPanel>, <OrganizationProfileGeneralPanel>).`);
		return false;
	}
	return true;
}

//#endregion
export { useRequirePage };
//# sourceMappingURL=useRequirePage.js.map