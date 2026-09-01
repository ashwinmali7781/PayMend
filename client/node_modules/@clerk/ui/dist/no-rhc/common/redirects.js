import { buildURL } from "@clerk/shared/internal/clerk-js/url";

//#region src/common/redirects.ts
const SSO_CALLBACK_PATH_ROUTE = "/sso-callback";
const MAGIC_LINK_VERIFY_PATH_ROUTE = "/verify";
function buildVerificationRedirectUrl({ ctx, baseUrl = "", intent = "sign-in" }) {
	const { routing, authQueryString, path } = ctx;
	return buildRedirectUrl({
		routing,
		baseUrl,
		authQueryString,
		path,
		endpoint: "isCombinedFlow" in ctx && ctx.isCombinedFlow && intent === "sign-up" ? `/create${MAGIC_LINK_VERIFY_PATH_ROUTE}` : MAGIC_LINK_VERIFY_PATH_ROUTE
	});
}
const buildRedirectUrl = ({ routing, authQueryString, baseUrl, path, endpoint }) => {
	if (!routing || routing === "hash") return buildHashBasedUrl(authQueryString, endpoint);
	if (routing === "path") return buildPathBasedUrl(path || "", authQueryString, endpoint);
	return buildVirtualBasedUrl(baseUrl || "", authQueryString, endpoint);
};
const buildHashBasedUrl = (authQueryString, endpoint) => {
	return buildURL({ hash: endpoint + (authQueryString ? `?${authQueryString}` : "") }, { stringify: true });
};
const buildPathBasedUrl = (path, authQueryString, endpoint) => {
	const searchArg = authQueryString ? { search: "?" + authQueryString } : {};
	return buildURL({
		pathname: path + endpoint,
		...searchArg
	}, { stringify: true });
};
const buildVirtualBasedUrl = (base, authQueryString, endpoint) => {
	return buildURL({
		base,
		hash: endpoint + (authQueryString ? `?${authQueryString}` : "")
	}, { stringify: true });
};

//#endregion
export { MAGIC_LINK_VERIFY_PATH_ROUTE, SSO_CALLBACK_PATH_ROUTE, buildRedirectUrl, buildVerificationRedirectUrl };
//# sourceMappingURL=redirects.js.map