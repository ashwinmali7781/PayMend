import { localizationKeys } from "../localization/localizationKeys.js";
import { canUseListFormat } from "./intl.js";

//#region src/utils/passwordUtils.ts
const mapComplexityErrors = (passwordSettings) => {
	return {
		form_password_length_too_long: [
			"unstable__errors.passwordComplexity.maximumLength",
			"length",
			passwordSettings.max_length
		],
		form_password_length_too_short: [
			"unstable__errors.passwordComplexity.minimumLength",
			"length",
			passwordSettings.min_length
		],
		form_password_no_uppercase: "unstable__errors.passwordComplexity.requireUppercase",
		form_password_no_lowercase: "unstable__errors.passwordComplexity.requireLowercase",
		form_password_no_number: "unstable__errors.passwordComplexity.requireNumbers",
		form_password_no_special_char: "unstable__errors.passwordComplexity.requireSpecialCharacter"
	};
};
const createPasswordError = (errors, localizationConfig) => {
	if (!localizationConfig) return errors[0].longMessage;
	const { t, locale, passwordSettings } = localizationConfig;
	if (errors?.[0]?.code === "form_password_size_in_bytes_exceeded" || errors?.[0]?.code === "form_password_pwned" || errors?.[0]?.code === "form_new_password_matches_current" || errors?.[0]?.code === "form_password_matches_identifier") return `${t(localizationKeys(`unstable__errors.${errors?.[0]?.code}`)) || errors?.[0]?.message}`;
	if (errors?.[0]?.code === "form_password_not_strong_enough") {
		const message = errors[0].meta?.zxcvbn?.suggestions?.map((s) => {
			return t(localizationKeys(`unstable__errors.zxcvbn.suggestions.${s.code}`));
		}).join(" ");
		return `${t(localizationKeys("unstable__errors.zxcvbn.notEnough"))} ${message}`;
	}
	const minLenErrors = errors.filter((e) => e.code === "form_password_length_too_short");
	const complexityErrors = mapComplexityErrors(passwordSettings);
	const knownErrors = (minLenErrors.length ? minLenErrors : errors).filter((e) => Object.hasOwn(complexityErrors, e.code));
	if (!knownErrors.length) return errors?.[0];
	const messageWithPrefix = createListFormat(knownErrors.map((s) => {
		const localizedKey = complexityErrors[s.code];
		if (Array.isArray(localizedKey)) {
			const [lk, attr, val] = localizedKey;
			return t(localizationKeys(lk, { [attr]: val }));
		}
		return t(localizationKeys(localizedKey));
	}), locale);
	return addFullStop(`${t(localizationKeys("unstable__errors.passwordComplexity.sentencePrefix"))} ${messageWithPrefix}`);
};
const addFullStop = (string) => {
	return !string ? "" : string.endsWith(".") ? string : `${string}.`;
};
const createListFormat = (message, locale) => {
	let messageWithPrefix;
	if (canUseListFormat(locale)) messageWithPrefix = new Intl.ListFormat(locale, {
		style: "long",
		type: "conjunction"
	}).format(message);
	else messageWithPrefix = message.join(", ");
	return messageWithPrefix;
};

//#endregion
export { addFullStop, createListFormat, createPasswordError };
//# sourceMappingURL=passwordUtils.js.map