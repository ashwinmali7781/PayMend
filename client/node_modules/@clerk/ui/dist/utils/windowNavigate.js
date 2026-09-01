import { windowNavigate } from "@clerk/shared/internal/clerk-js/windowNavigate";

//#region src/utils/windowNavigate.ts
function clerkWindowNavigate(clerk, to, opts) {
	const clerkWindowNavigate = clerk.__internal_windowNavigate;
	if (typeof clerkWindowNavigate === "function") return clerkWindowNavigate.call(clerk, to, opts);
	return windowNavigate(to);
}

//#endregion
export { clerkWindowNavigate };
//# sourceMappingURL=windowNavigate.js.map