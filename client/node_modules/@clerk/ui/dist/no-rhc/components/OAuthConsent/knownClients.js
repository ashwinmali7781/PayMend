import SvgClaude from "./claude.js";
import SvgOpenai from "./openai.js";

//#region src/components/OAuthConsent/knownClients.ts
const KNOWN_OAUTH_CLIENTS = [{
	name: "Claude",
	icon: SvgClaude,
	domains: [
		"claude.ai",
		"claude.com",
		"anthropic.com"
	]
}, {
	name: "ChatGPT",
	icon: SvgOpenai,
	iconSx: (t) => ({ color: t.colors.$colorForeground }),
	domains: ["chatgpt.com", "openai.com"]
}];
/**
* Resolves a known OAuth client from its registrable redirect domain, or
* `undefined` when the domain is empty or unrecognized.
*/
function getKnownOAuthClient(domain) {
	if (!domain) return;
	const normalized = domain.trim().toLowerCase();
	return KNOWN_OAUTH_CLIENTS.find((client) => client.domains.includes(normalized));
}

//#endregion
export { getKnownOAuthClient };
//# sourceMappingURL=knownClients.js.map