import { localizationKeys } from "../localization/localizationKeys.js";
import { formatRelative } from "@clerk/shared/date";

//#region src/utils/getRelativeToNowDateKey.ts
const getRelativeToNowDateKey = (date) => {
	const relativeDate = formatRelative({
		date: date || /* @__PURE__ */ new Date(),
		relativeTo: /* @__PURE__ */ new Date()
	});
	if (!relativeDate) return "";
	switch (relativeDate.relativeDateCase) {
		case "previous6Days": return localizationKeys("dates.previous6Days", { date: relativeDate.date });
		case "lastDay": return localizationKeys("dates.lastDay", { date: relativeDate.date });
		case "sameDay": return localizationKeys("dates.sameDay", { date: relativeDate.date });
		case "nextDay": return localizationKeys("dates.nextDay", { date: relativeDate.date });
		case "next6Days": return localizationKeys("dates.next6Days", { date: relativeDate.date });
		default: return localizationKeys("dates.numeric", { date: relativeDate.date });
	}
};

//#endregion
export { getRelativeToNowDateKey };
//# sourceMappingURL=getRelativeToNowDateKey.js.map