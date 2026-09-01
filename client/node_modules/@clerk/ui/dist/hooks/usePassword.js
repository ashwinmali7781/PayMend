import { useModuleManager } from "../contexts/ModuleManagerContext.js";
import { localizationKeys } from "../localization/localizationKeys.js";
import { generateErrorTextUtil } from "./usePasswordComplexity.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { noop } from "@clerk/shared/utils";
import { useCallback, useMemo } from "react";
import { createLoadZxcvbn } from "@clerk/shared/internal/clerk-js/passwords/loadZxcvbn";
import { createValidatePassword } from "@clerk/shared/internal/clerk-js/passwords/password";

//#region src/hooks/usePassword.ts
const usePassword = (config, callbacks) => {
	const { t, locale } = useLocalizations();
	const moduleManager = useModuleManager();
	const { onValidationError = noop, onValidationSuccess = noop, onValidationWarning = noop, onValidationInfo = noop, onValidationComplexity } = callbacks || {};
	const onValidate = useCallback((res) => {
		/**
		* Failed complexity rules always have priority
		*/
		if (Object.values(res?.complexity || {}).length > 0) {
			const message = generateErrorTextUtil({
				config,
				t,
				failedValidations: res.complexity,
				locale
			});
			if (res.complexity?.min_length) return onValidationInfo(message);
			return onValidationError(message);
		}
		/**
		* Failed strength
		*/
		if (res?.strength?.state === "fail") return onValidationError(res.strength.keys.map((localizationKey) => t(localizationKeys(localizationKey))).join(" "));
		/**
		* Password meets all criteria but could be stronger
		*/
		if (res?.strength?.state === "pass") return onValidationWarning(res.strength.keys.map((localizationKey) => t(localizationKeys(localizationKey))).join(" "));
		/**
		* Password meets all criteria and is strong
		*/
		return onValidationSuccess();
	}, [
		callbacks,
		t,
		locale
	]);
	return { validatePassword: useMemo(() => {
		const { loadZxcvbn } = createLoadZxcvbn(moduleManager);
		return createValidatePassword(loadZxcvbn, config, {
			onValidation: onValidate,
			onValidationComplexity
		});
	}, [
		onValidate,
		config,
		moduleManager
	]) };
};
const useConfirmPassword = ({ passwordField, confirmPasswordField }) => {
	const { t } = useLocalizations();
	const checkPasswordMatch = useCallback((confirmPassword) => passwordField.value === confirmPassword, [passwordField.value]);
	const isPasswordMatch = useMemo(() => checkPasswordMatch(confirmPasswordField.value), [checkPasswordMatch, confirmPasswordField.value]);
	return {
		setConfirmPasswordFeedback: useCallback((password) => {
			if (checkPasswordMatch(password)) confirmPasswordField.setSuccess(t(localizationKeys("formFieldError__matchingPasswords")));
			else confirmPasswordField.setError(t(localizationKeys("formFieldError__notMatchingPasswords")));
		}, [
			confirmPasswordField.setError,
			confirmPasswordField.setSuccess,
			t,
			checkPasswordMatch
		]),
		isPasswordMatch
	};
};

//#endregion
export { useConfirmPassword, usePassword };
//# sourceMappingURL=usePassword.js.map