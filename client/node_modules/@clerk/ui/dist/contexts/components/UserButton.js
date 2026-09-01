import { useOptions } from "../OptionsContext.js";
import { useRouter } from "../../router/RouteContext.js";
import { useEnvironment } from "../EnvironmentContext.js";
import { createUserButtonCustomMenuItems } from "../../utils/createCustomMenuItems.js";
import { createContext, useContext, useMemo } from "react";
import { useClerk } from "@clerk/shared/react";

//#region src/contexts/components/UserButton.ts
const UserButtonContext = createContext(null);
const useUserButtonContext = () => {
	const context = useContext(UserButtonContext);
	const clerk = useClerk();
	const { navigate } = useRouter();
	const { displayConfig } = useEnvironment();
	const options = useOptions();
	if (!context || context.componentName !== "UserButton") throw new Error("Clerk: useUserButtonContext called outside of the mounted UserButton component.");
	const { componentName, customMenuItems, ...ctx } = context;
	const signInUrl = ctx.signInUrl || options.signInUrl || displayConfig.signInUrl;
	const userProfileUrl = ctx.userProfileUrl || displayConfig.userProfileUrl;
	const afterSignOutUrl = clerk.buildAfterSignOutUrl();
	const navigateAfterSignOut = () => navigate(afterSignOutUrl);
	const afterMultiSessionSingleSignOutUrl = clerk.buildAfterMultiSessionSingleSignOutUrl();
	const navigateAfterMultiSessionSingleSignOut = () => clerk.redirectWithAuth(afterMultiSessionSingleSignOutUrl);
	const afterSwitchSessionUrl = ctx.afterSwitchSessionUrl || displayConfig.afterSwitchSessionUrl;
	const userProfileMode = !!ctx.userProfileUrl && !ctx.userProfileMode ? "navigation" : ctx.userProfileMode;
	const menuItems = useMemo(() => {
		return createUserButtonCustomMenuItems(customMenuItems || [], clerk);
	}, []);
	return {
		...ctx,
		componentName,
		navigateAfterMultiSessionSingleSignOut,
		navigateAfterSignOut,
		signInUrl,
		userProfileUrl,
		afterMultiSessionSingleSignOutUrl,
		afterSignOutUrl,
		afterSwitchSessionUrl,
		userProfileMode: userProfileMode || "modal",
		menutItems: menuItems
	};
};

//#endregion
export { UserButtonContext, useUserButtonContext };
//# sourceMappingURL=UserButton.js.map