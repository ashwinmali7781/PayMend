import { localizationKeys } from "../localization/localizationKeys.js";

//#region src/utils/timeAgo.ts
function timeAgo(date) {
	const now = /* @__PURE__ */ new Date();
	const then = new Date(date);
	if (isNaN(then.getTime())) return "";
	const seconds = Math.floor((now.getTime() - then.getTime()) / 1e3);
	if (seconds < 60) return localizationKeys("apiKeys.lastUsed__seconds", { seconds });
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return localizationKeys("apiKeys.lastUsed__minutes", { minutes });
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return localizationKeys("apiKeys.lastUsed__hours", { hours });
	const days = Math.floor(hours / 24);
	if (days < 30) return localizationKeys("apiKeys.lastUsed__days", { days });
	const months = Math.floor(days / 30);
	if (months < 12) return localizationKeys("apiKeys.lastUsed__months", { months });
	return localizationKeys("apiKeys.lastUsed__years", { years: Math.floor(months / 12) });
}

//#endregion
export { timeAgo };
//# sourceMappingURL=timeAgo.js.map