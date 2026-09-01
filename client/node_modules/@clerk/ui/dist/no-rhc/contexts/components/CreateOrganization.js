import { useRouter } from "../../router/RouteContext.js";
import { populateParamFromObject } from "../utils.js";
import { useEnvironment } from "../EnvironmentContext.js";
import { createContext, useContext } from "react";

//#region src/contexts/components/CreateOrganization.ts
const CreateOrganizationContext = createContext(null);
const useCreateOrganizationContext = () => {
	const context = useContext(CreateOrganizationContext);
	const { navigate } = useRouter();
	const { displayConfig } = useEnvironment();
	if (!context || context.componentName !== "CreateOrganization") throw new Error("Clerk: useCreateOrganizationContext called outside CreateOrganization.");
	const { componentName, ...ctx } = context;
	const navigateAfterCreateOrganization = (organization) => {
		if (typeof ctx.afterCreateOrganizationUrl === "function") return navigate(ctx.afterCreateOrganizationUrl(organization));
		if (ctx.afterCreateOrganizationUrl) return navigate(populateParamFromObject({
			urlWithParam: ctx.afterCreateOrganizationUrl,
			entity: organization
		}));
		return navigate(displayConfig.afterCreateOrganizationUrl);
	};
	return {
		...ctx,
		skipInvitationScreen: ctx.skipInvitationScreen || false,
		navigateAfterCreateOrganization,
		componentName
	};
};

//#endregion
export { CreateOrganizationContext, useCreateOrganizationContext };
//# sourceMappingURL=CreateOrganization.js.map