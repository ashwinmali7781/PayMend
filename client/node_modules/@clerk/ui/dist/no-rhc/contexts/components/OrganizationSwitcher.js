import { useRouter } from "../../router/RouteContext.js";
import { populateParamFromObject } from "../utils.js";
import { useEnvironment } from "../EnvironmentContext.js";
import { createContext, useContext } from "react";

//#region src/contexts/components/OrganizationSwitcher.ts
const OrganizationSwitcherContext = createContext(null);
const useOrganizationSwitcherContext = () => {
	const context = useContext(OrganizationSwitcherContext);
	const { navigate } = useRouter();
	const { displayConfig, organizationSettings } = useEnvironment();
	if (!context || context.componentName !== "OrganizationSwitcher") throw new Error("Clerk: useOrganizationSwitcherContext called outside OrganizationSwitcher.");
	const { componentName, ...ctx } = context;
	const afterCreateOrganizationUrl = ctx.afterCreateOrganizationUrl || displayConfig.afterCreateOrganizationUrl;
	const afterLeaveOrganizationUrl = ctx.afterLeaveOrganizationUrl || displayConfig.afterLeaveOrganizationUrl;
	const navigateCreateOrganization = () => navigate(ctx.createOrganizationUrl || displayConfig.createOrganizationUrl);
	const navigateOrganizationProfile = () => navigate(ctx.organizationProfileUrl || displayConfig.organizationProfileUrl);
	const navigateAfterSelectOrganizationOrPersonal = ({ organization, user }) => {
		const redirectUrl = getAfterSelectOrganizationOrPersonalUrl({
			organization,
			user
		});
		if (redirectUrl) return navigate(redirectUrl);
		return Promise.resolve();
	};
	const getAfterSelectOrganizationOrPersonalUrl = ({ organization, user }) => {
		if (typeof ctx.afterSelectPersonalUrl === "function" && user) return ctx.afterSelectPersonalUrl(user);
		if (typeof ctx.afterSelectOrganizationUrl === "function" && organization) return ctx.afterSelectOrganizationUrl(organization);
		if (ctx.afterSelectPersonalUrl && user) return populateParamFromObject({
			urlWithParam: ctx.afterSelectPersonalUrl,
			entity: user
		});
		if (ctx.afterSelectOrganizationUrl && organization) return populateParamFromObject({
			urlWithParam: ctx.afterSelectOrganizationUrl,
			entity: organization
		});
	};
	const navigateAfterSelectOrganization = (organization) => navigateAfterSelectOrganizationOrPersonal({ organization });
	const navigateAfterSelectPersonal = (user) => navigateAfterSelectOrganizationOrPersonal({ user });
	const afterSelectOrganizationUrl = (organization) => getAfterSelectOrganizationOrPersonalUrl({ organization });
	const afterSelectPersonalUrl = (user) => getAfterSelectOrganizationOrPersonalUrl({ user });
	const organizationProfileMode = !!ctx.organizationProfileUrl && !ctx.organizationProfileMode ? "navigation" : ctx.organizationProfileMode;
	const createOrganizationMode = !!ctx.createOrganizationUrl && !ctx.createOrganizationMode ? "navigation" : ctx.createOrganizationMode;
	return {
		...ctx,
		hidePersonal: organizationSettings.forceOrganizationSelection || ctx.hidePersonal || false,
		organizationProfileMode: organizationProfileMode || "modal",
		createOrganizationMode: createOrganizationMode || "modal",
		skipInvitationScreen: ctx.skipInvitationScreen || false,
		afterCreateOrganizationUrl,
		afterLeaveOrganizationUrl,
		navigateOrganizationProfile,
		navigateCreateOrganization,
		navigateAfterSelectOrganization,
		navigateAfterSelectPersonal,
		afterSelectOrganizationUrl,
		afterSelectPersonalUrl,
		componentName
	};
};

//#endregion
export { OrganizationSwitcherContext, useOrganizationSwitcherContext };
//# sourceMappingURL=OrganizationSwitcher.js.map