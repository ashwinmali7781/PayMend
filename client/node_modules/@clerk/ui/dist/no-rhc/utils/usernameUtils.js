import { localizationKeys } from "../localization/localizationKeys.js";

//#region src/utils/usernameUtils.ts
const INVALID_LENGTH = "form_username_invalid_length";
const NEEDS_NON_NUMBER_CHAR = "form_username_needs_non_number_char";
const createUsernameError = (errors, localizationConfig) => {
	const { t, usernameSettings } = localizationConfig;
	const clerkApiError = errors[0];
	if (!localizationConfig) return clerkApiError;
	if (clerkApiError?.code === INVALID_LENGTH) return t(localizationKeys(`unstable__errors.${INVALID_LENGTH}`, {
		min_length: usernameSettings.min_length,
		max_length: usernameSettings.max_length
	}));
	if (clerkApiError?.code === NEEDS_NON_NUMBER_CHAR) return t(localizationKeys(`unstable__errors.${NEEDS_NON_NUMBER_CHAR}`));
	return clerkApiError;
};

//#endregion
export { createUsernameError };
//# sourceMappingURL=usernameUtils.js.map