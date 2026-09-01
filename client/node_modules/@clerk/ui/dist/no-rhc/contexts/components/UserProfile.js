import { useRouter } from "../../router/RouteContext.js";
import { useEnvironment } from "../EnvironmentContext.js";
import { createUserProfileCustomPages } from "../../utils/createCustomPages.js";
import { useStatements, useSubscription } from "./Plans.js";
import { createContext, useContext, useMemo } from "react";
import { useClerk, useUser } from "@clerk/shared/react";

//#region src/contexts/components/UserProfile.ts
const UserProfileContext = createContext(null);
const useUserProfileContext = () => {
	const context = useContext(UserProfileContext);
	const { queryParams } = useRouter();
	const clerk = useClerk();
	const environment = useEnvironment();
	const { user } = useUser();
	const subscription = useSubscription();
	const statements = useStatements();
	const hasNonFreeSubscription = subscription.data?.subscriptionItems.some((item) => item.plan.hasBaseFee);
	const shouldShowBilling = environment.commerceSettings.billing.user.hasPaidPlans || hasNonFreeSubscription || Boolean(statements.data.length > 0);
	if (!context || context.componentName !== "UserProfile") throw new Error("Clerk: useUserProfileContext called outside of the mounted UserProfile component.");
	const { componentName, customPages, ...ctx } = context;
	const pages = useMemo(() => {
		return createUserProfileCustomPages(customPages || [], clerk, shouldShowBilling, environment);
	}, [customPages, shouldShowBilling]);
	const shouldAllowIdentificationCreation = useMemo(() => {
		const { enterpriseSSO } = environment.userSettings;
		return !(user && enterpriseSSO.enabled) || !user?.enterpriseAccounts.some((enterpriseAccount) => enterpriseAccount.active && enterpriseAccount.enterpriseConnection?.disableAdditionalIdentifications);
	}, [user, environment.userSettings.enterpriseSSO]);
	const immutableAttributes = useMemo(() => {
		const result = /* @__PURE__ */ new Set();
		for (const [name, data] of Object.entries(environment.userSettings.attributes)) if (data.immutable) result.add(name);
		return result;
	}, [environment.userSettings.attributes]);
	return {
		...ctx,
		pages,
		componentName,
		queryParams,
		authQueryString: "",
		shouldAllowIdentificationCreation,
		shouldShowBilling,
		immutableAttributes
	};
};

//#endregion
export { UserProfileContext, useUserProfileContext };
//# sourceMappingURL=UserProfile.js.map