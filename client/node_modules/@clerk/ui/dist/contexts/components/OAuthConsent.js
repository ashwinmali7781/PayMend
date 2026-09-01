import { createContext, useContext } from "react";

//#region src/contexts/components/OAuthConsent.ts
const OAuthConsentContext = createContext(null);
const useOAuthConsentContext = () => {
	const context = useContext(OAuthConsentContext);
	if (context === null) throw new Error("Clerk: useOAuthConsentContext called outside of the mounted OAuthConsent component.");
	return context;
};

//#endregion
export { OAuthConsentContext, useOAuthConsentContext };
//# sourceMappingURL=OAuthConsent.js.map