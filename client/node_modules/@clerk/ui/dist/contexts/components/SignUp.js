import { useOptions } from "../OptionsContext.js";
import { useRouter } from "../../router/RouteContext.js";
import { getInitialValuesFromQueryParams } from "../utils.js";
import { useEnvironment } from "../EnvironmentContext.js";
import { MAGIC_LINK_VERIFY_PATH_ROUTE, SSO_CALLBACK_PATH_ROUTE, buildRedirectUrl } from "../../common/redirects.js";
import { clerkWindowNavigate } from "../../utils/windowNavigate.js";
import { createContext, useContext, useMemo } from "react";
import { SIGN_UP_INITIAL_VALUE_KEYS } from "@clerk/shared/internal/clerk-js/constants";
import { useClerk } from "@clerk/shared/react";
import { buildURL } from "@clerk/shared/internal/clerk-js/url";
import { isAbsoluteUrl } from "@clerk/shared/url";
import { RedirectUrls } from "@clerk/shared/internal/clerk-js/redirectUrls";
import { getTaskEndpoint } from "@clerk/shared/internal/clerk-js/sessionTasks";

//#region src/contexts/components/SignUp.ts
const SignUpContext = createContext(null);
const useSignUpContext = () => {
	const context = useContext(SignUpContext);
	const { navigate, basePath, startPath } = useRouter();
	const { displayConfig, userSettings } = useEnvironment();
	const { queryParams, queryString } = useRouter();
	const signUpMode = userSettings.signUp.mode;
	const options = useOptions();
	const clerk = useClerk();
	const isCombinedFlow = signUpMode !== "restricted" && Boolean(!options.signUpUrl && options.signInUrl && !isAbsoluteUrl(options.signInUrl) && signUpMode === "public") || false;
	const initialValuesFromQueryParams = useMemo(() => getInitialValuesFromQueryParams(queryString, SIGN_UP_INITIAL_VALUE_KEYS), []);
	if (!context || context.componentName !== "SignUp") throw new Error("Clerk: useSignUpContext called outside of the mounted SignUp component.");
	const { componentName, mode, ...ctx } = context;
	const redirectUrls = new RedirectUrls(options, {
		...ctx,
		signUpFallbackRedirectUrl: ctx.signUpFallbackRedirectUrl || ctx.fallbackRedirectUrl,
		signUpForceRedirectUrl: ctx.signUpForceRedirectUrl || ctx.forceRedirectUrl
	}, queryParams, mode);
	delete ctx.fallbackRedirectUrl;
	delete ctx.forceRedirectUrl;
	const afterSignUpUrl = clerk.buildUrlWithAuth(redirectUrls.getAfterSignUpUrl());
	const afterSignInUrl = clerk.buildUrlWithAuth(redirectUrls.getAfterSignInUrl());
	const navigateAfterSignUp = () => navigate(afterSignUpUrl);
	let signUpUrl = ctx.routing === "path" && ctx.path || options.signUpUrl || displayConfig.signUpUrl;
	let signInUrl = ctx.signInUrl || options.signInUrl || displayConfig.signInUrl;
	let waitlistUrl = ctx.waitlistUrl || options.waitlistUrl || displayConfig.waitlistUrl;
	const preservedParams = redirectUrls.getPreservedSearchParams();
	signInUrl = buildURL({
		base: signInUrl,
		hashSearchParams: [queryParams, preservedParams]
	}, { stringify: true });
	signUpUrl = buildURL({
		base: signUpUrl,
		hashSearchParams: [queryParams, preservedParams]
	}, { stringify: true });
	waitlistUrl = buildURL({
		base: waitlistUrl,
		hashSearchParams: [queryParams, preservedParams]
	}, { stringify: true });
	const authQueryString = redirectUrls.toSearchParams().toString();
	const emailLinkRedirectUrl = ctx.emailLinkRedirectUrl ?? buildRedirectUrl({
		routing: ctx.routing,
		baseUrl: signUpUrl,
		authQueryString,
		path: ctx.path,
		endpoint: isCombinedFlow ? "/create" + "/verify" : "/verify"
	});
	const ssoCallbackUrl = ctx.ssoCallbackUrl ?? buildRedirectUrl({
		routing: ctx.routing,
		baseUrl: signUpUrl,
		authQueryString,
		path: ctx.path,
		endpoint: isCombinedFlow ? "/create" + "/sso-callback" : "/sso-callback"
	});
	const secondFactorUrl = buildURL({
		base: signInUrl,
		hashPath: "/factor-two"
	}, { stringify: true });
	const navigateOnSetActive = async ({ session, redirectUrl, decorateUrl }) => {
		const currentTask = session.currentTask;
		if (!currentTask) {
			const decoratedUrl = decorateUrl(redirectUrl);
			if (decoratedUrl !== redirectUrl && /^https?:\/\//.test(decoratedUrl)) {
				clerkWindowNavigate(clerk, decoratedUrl);
				return;
			}
			return navigate(redirectUrl);
		}
		const taskEndpoint = getTaskEndpoint(currentTask);
		return navigate(`/${basePath + startPath + taskEndpoint}`);
	};
	const taskUrl = clerk.session?.currentTask ? clerk.__internal_getOption("taskUrls")?.[clerk.session?.currentTask.key] ?? buildRedirectUrl({
		routing: ctx.routing,
		baseUrl: signInUrl,
		authQueryString,
		path: ctx.path,
		endpoint: getTaskEndpoint(clerk.session?.currentTask)
	}) : null;
	return {
		...ctx,
		oauthFlow: ctx.oauthFlow || "auto",
		componentName,
		signInUrl,
		signUpUrl,
		waitlistUrl,
		secondFactorUrl,
		afterSignUpUrl,
		afterSignInUrl,
		emailLinkRedirectUrl,
		ssoCallbackUrl,
		navigateAfterSignUp,
		queryParams,
		initialValues: {
			...ctx.initialValues,
			...initialValuesFromQueryParams
		},
		authQueryString,
		isCombinedFlow,
		navigateOnSetActive,
		taskUrl
	};
};

//#endregion
export { SignUpContext, useSignUpContext };
//# sourceMappingURL=SignUp.js.map