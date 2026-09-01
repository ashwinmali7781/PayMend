import { ClerkRuntimeError } from "@clerk/shared/error";

//#region src/components/UserProfile/oauthTransport.ts
function getExternalVerificationRedirectURL(response) {
	const url = response?.verification?.externalVerificationRedirectURL;
	if (!url) throw new ClerkRuntimeError("OAuth flow did not receive a verification URL.", { code: "oauth_missing_verification_url" });
	return url;
}
async function reloadUserAfterOAuthCallback(user, callbackUrl) {
	const nonce = new URL(callbackUrl).searchParams.get("rotating_token_nonce");
	if (nonce) {
		await user.reload({ rotatingTokenNonce: nonce });
		return;
	}
	await user.reload();
}

//#endregion
export { getExternalVerificationRedirectURL, reloadUserAfterOAuthCallback };
//# sourceMappingURL=oauthTransport.js.map