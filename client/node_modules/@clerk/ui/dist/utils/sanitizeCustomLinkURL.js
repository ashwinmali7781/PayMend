import { isValidUrl } from "@clerk/shared/internal/clerk-js/url";

//#region src/utils/sanitizeCustomLinkURL.ts
const sanitizeCustomLinkURL = (url) => {
	if (!url) throw new Error("Clerk: URL is required for custom links");
	if (isValidUrl(url)) return url;
	return url.charAt(0) === "/" ? url : `/${url}`;
};

//#endregion
export { sanitizeCustomLinkURL };
//# sourceMappingURL=sanitizeCustomLinkURL.js.map