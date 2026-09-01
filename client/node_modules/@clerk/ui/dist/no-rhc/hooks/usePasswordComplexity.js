import { localizationKeys } from "../localization/localizationKeys.js";
import { addFullStop, createListFormat } from "../utils/passwordUtils.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import "@clerk/shared/internal/clerk-js/passwords/complexity";

//#region src/hooks/usePasswordComplexity.ts
const errorMessages = {
	max_length: ["unstable__errors.passwordComplexity.maximumLength", "length"],
	min_length: ["unstable__errors.passwordComplexity.minimumLength", "length"],
	require_numbers: "unstable__errors.passwordComplexity.requireNumbers",
	require_lowercase: "unstable__errors.passwordComplexity.requireLowercase",
	require_uppercase: "unstable__errors.passwordComplexity.requireUppercase",
	require_special_char: "unstable__errors.passwordComplexity.requireSpecialCharacter"
};
const generateErrorTextUtil = ({ config, failedValidations, locale, t }) => {
	if (!failedValidations || Object.keys(failedValidations).length === 0) return "";
	const hasMinLengthError = failedValidations?.min_length || false;
	const messageWithPrefix = createListFormat(Object.entries(failedValidations).filter((k) => hasMinLengthError ? k[0] === "min_length" : true).filter(([, v]) => !!v).map(([k]) => {
		const localizedKey = errorMessages[k];
		if (Array.isArray(localizedKey)) {
			const [lk, attr] = localizedKey;
			return t(localizationKeys(lk, { [attr]: config[k] }));
		}
		return t(localizationKeys(localizedKey));
	}), locale);
	return addFullStop(`${t(localizationKeys("unstable__errors.passwordComplexity.sentencePrefix"))} ${messageWithPrefix}`);
};

//#endregion
export { generateErrorTextUtil };
//# sourceMappingURL=usePasswordComplexity.js.map