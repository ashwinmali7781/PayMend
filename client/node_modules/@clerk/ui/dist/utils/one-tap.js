import { clerkFailedToLoadThirdPartyScript } from "@clerk/shared/internal/clerk-js/errors";
import { loadScript } from "@clerk/shared/loadScript";

//#region src/utils/one-tap.ts
async function loadGIS() {
	if (!window.google) try {
		await loadScript("https://accounts.google.com/gsi/client", { defer: true });
	} catch {
		clerkFailedToLoadThirdPartyScript("Google Identity Services");
	}
	return window.google;
}

//#endregion
export { loadGIS };
//# sourceMappingURL=one-tap.js.map