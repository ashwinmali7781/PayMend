import { useOptions } from "../contexts/OptionsContext.js";
import { defaultResource } from "./defaultEnglishResource.js";
import { fastDeepMergeAndReplace } from "@clerk/shared/utils";
import { dequal } from "dequal";

//#region src/localization/parseLocalization.ts
let cache;
let prev;
const parseLocalizationResource = (userDefined, base) => {
	if (!cache || !!prev && prev !== userDefined && !dequal(userDefined, prev)) {
		prev = userDefined;
		const res = {};
		fastDeepMergeAndReplace(base, res);
		fastDeepMergeAndReplace(userDefined, res);
		cache = res;
		return cache;
	}
	return cache;
};
const useParsedLocalizationResource = () => {
	const { localization } = useOptions();
	return parseLocalizationResource(localization || {}, defaultResource);
};

//#endregion
export { useParsedLocalizationResource };
//# sourceMappingURL=parseLocalization.js.map