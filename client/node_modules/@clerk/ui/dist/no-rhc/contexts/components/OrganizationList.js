import { useRouter } from "../../router/RouteContext.js";
import { populateParamFromObject } from "../utils.js";
import { useEnvironment } from "../EnvironmentContext.js";
import { createContext, useContext } from "react";

//#region src/contexts/components/OrganizationList.ts
const OrganizationListContext = createContext(null);
const useOrganizationListContext = () => {
	const context = useContext(OrganizationListContext);
	const { navigate } = useRouter();
	const { displayConfig, organizationSettings } = useEnvironment();
	if (!context || context.componentName !== "OrganizationList") throw new Error("Clerk: useOrganizationListContext called outside OrganizationList.");
	const { componentName, ...ctx } = context;
	const afterCreateOrganizationUrl = ctx.afterCreateOrganizationUrl || displayConfig.afterCreateOrganizationUrl;
	const navigateAfterCreateOrganization = (organization) => {
		if (typeof ctx.afterCreateOrganizationUrl === "function") return navigate(ctx.afterCreateOrganizationUrl(organization));
		if (ctx.afterCreateOrganizationUrl) return navigate(populateParamFromObject({
			urlWithParam: ctx.afterCreateOrganizationUrl,
			entity: organization
		}));
		return navigate(displayConfig.afterCreateOrganizationUrl);
	};
	const navigateAfterSelectOrganizationOrPersonal = ({ organization, user }) => {
		if (typeof ctx.afterSelectPersonalUrl === "function" && user) return navigate(ctx.afterSelectPersonalUrl(user));
		if (typeof ctx.afterSelectOrganizationUrl === "function" && organization) return navigate(ctx.afterSelectOrganizationUrl(organization));
		if (ctx.afterSelectPersonalUrl && user) return navigate(populateParamFromObject({
			urlWithParam: ctx.afterSelectPersonalUrl,
			entity: user
		}));
		if (ctx.afterSelectOrganizationUrl && organization) return navigate(populateParamFromObject({
			urlWithParam: ctx.afterSelectOrganizationUrl,
			entity: organization
		}));
		return Promise.resolve();
	};
	const navigateAfterSelectOrganization = (organization) => navigateAfterSelectOrganizationOrPersonal({ organization });
	const navigateAfterSelectPersonal = (user) => navigateAfterSelectOrganizationOrPersonal({ user });
	return {
		...ctx,
		afterCreateOrganizationUrl,
		skipInvitationScreen: ctx.skipInvitationScreen || false,
		hidePersonal: organizationSettings.forceOrganizationSelection || ctx.hidePersonal || false,
		navigateAfterCreateOrganization,
		navigateAfterSelectOrganization,
		navigateAfterSelectPersonal,
		componentName
	};
};

//#endregion
export { OrganizationListContext, useOrganizationListContext };
//# sourceMappingURL=OrganizationList.js.map