//#region src/components/OAuthConsent/utils.ts
const canReadLocation = () => typeof window !== "undefined" && !!window.location;
const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
function getRedirectDisplay(url) {
	let hostname;
	try {
		hostname = new URL(url).hostname;
	} catch {
		return "";
	}
	if (!hostname) return "";
	const host = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
	if (IPV4_REGEX.test(host)) return host;
	if (host.includes(":")) return `[${host}]`;
	return host.split(".").slice(-2).join(".");
}
function getRedirectUriFromSearch() {
	if (!canReadLocation()) return "";
	return new URL(window.location.href).searchParams.get("redirect_uri") ?? "";
}
function getOAuthConsentFromSearch() {
	if (!canReadLocation()) return { oauthClientId: "" };
	const sp = new URLSearchParams(window.location.search);
	const oauthClientId = sp.get("client_id") ?? "";
	const scope = sp.get("scope") ?? void 0;
	return scope !== void 0 ? {
		oauthClientId,
		scope
	} : { oauthClientId };
}
function getForwardedParams() {
	if (!canReadLocation()) return [];
	return Array.from(new URLSearchParams(window.location.search).entries());
}

//#endregion
export { getForwardedParams, getOAuthConsentFromSearch, getRedirectDisplay, getRedirectUriFromSearch };
//# sourceMappingURL=utils.js.map