import { useOptions } from "../contexts/OptionsContext.js";
import { localizationKeys } from "./localizationKeys.js";
import { readObjectPath } from "../utils/readObjectPath.js";
import { applyTokensToString, useGlobalTokens } from "./applyTokensToString.js";
import { applyMarkupAndTokens, stripMarkup } from "./applyMarkupToNodes.js";
import { defaultResource } from "./defaultEnglishResource.js";
import { useParsedLocalizationResource } from "./parseLocalization.js";
import { useCurrencyFormatter } from "./useCurrencyFormatter.js";
import { isClerkRuntimeError } from "@clerk/shared/error";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/localization/makeLocalizable.tsx
const makeLocalizable = (Component) => {
	const localizableComponent = React.forwardRef((props, ref) => {
		const parsedResource = useParsedLocalizationResource();
		const { localizationKey, ...restProps } = props;
		const globalTokens = useGlobalTokens();
		if (!localizationKey) return /* @__PURE__ */ jsx(Component, {
			...restProps,
			ref
		});
		if (typeof localizationKey === "string") return /* @__PURE__ */ jsx(Component, {
			...restProps,
			ref,
			children: localizationKey
		});
		return /* @__PURE__ */ jsx(Component, {
			...restProps,
			ref,
			"data-localization-key": localizationKeyAttribute(localizationKey),
			children: localizedNodeFromKey(localizationKey, parsedResource, globalTokens) || restProps.children
		});
	});
	localizableComponent.displayName = `Localizable${Component.displayName || Component.name || "Component"}`.replace("_", "");
	return localizableComponent;
};
const useLocalizations = () => {
	const { localization } = useOptions();
	const parsedResource = useParsedLocalizationResource();
	const globalTokens = useGlobalTokens();
	const locale = localization?.locale || defaultResource.locale;
	const $ = useCurrencyFormatter(locale);
	const t = (localizationKey) => {
		if (!localizationKey || typeof localizationKey === "string") return localizationKey || "";
		return stripMarkup(localizedStringFromKey(localizationKey, parsedResource, globalTokens));
	};
	/**
	* Translates a Clerk error message based on its code.
	*
	* @remarks
	* - For `ClerkRuntimeError`, it attempts to find a localized message using the error code.
	* - For `ClerkAPIError`, it tries to find a localized message using the error code and parameter name.
	* - If no localized message is found, it falls back to the original error message.
	*/
	const translateError = (error) => {
		if (!error || typeof error === "string") return t(error);
		if (isClerkRuntimeError(error)) return t(localizationKeys(`unstable__errors.${error.code}`)) || error.message;
		const { code, message, longMessage, meta } = error || {};
		const { paramName = "" } = meta || {};
		if (!code) return "";
		return t(localizationKeys(`unstable__errors.${code}__${paramName}`)) || t(localizationKeys(`unstable__errors.${code}`)) || longMessage || message;
	};
	return {
		t,
		translateError,
		locale,
		$
	};
};
const localizationKeyAttribute = (localizationKey) => {
	return localizationKey.key;
};
const resolveKey = (localizationKey, resource, globalTokens) => ({
	base: readObjectPath(resource, localizationKey.key),
	tokens: {
		...globalTokens,
		...localizationKey.params
	}
});
const localizedStringFromKey = (localizationKey, resource, globalTokens) => {
	const { base, tokens } = resolveKey(localizationKey, resource, globalTokens);
	return applyTokensToString(base || "", tokens);
};
const localizedNodeFromKey = (localizationKey, resource, globalTokens) => {
	const { base, tokens } = resolveKey(localizationKey, resource, globalTokens);
	return applyMarkupAndTokens(base, tokens);
};

//#endregion
export { makeLocalizable, useLocalizations };
//# sourceMappingURL=makeLocalizable.js.map