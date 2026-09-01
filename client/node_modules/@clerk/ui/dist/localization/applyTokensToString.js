import { useEnvironment } from "../contexts/EnvironmentContext.js";
import { MODIFIERS } from "./localizationModifiers.js";
import { useClerk } from "@clerk/shared/react";

//#region src/localization/applyTokensToString.ts
const applyTokensToString = (s, tokens) => {
	if (!s) return "";
	const { normalisedString, expressions } = parseTokensFromLocalizedString(s, tokens);
	return applyTokenExpressions(normalisedString, expressions, tokens);
};
const useGlobalTokens = () => {
	const { applicationName } = useEnvironment().displayConfig;
	const { client, user } = useClerk();
	const { signIn } = client || {};
	return {
		applicationName,
		"signIn.identifier": signIn?.identifier || "",
		"user.username": user?.username || "",
		"user.firstName": user?.firstName || "",
		"user.lastName": user?.lastName || "",
		"user.primaryEmailAddress": user?.primaryEmailAddress?.emailAddress || "",
		"user.primaryPhoneNumber": user?.primaryPhoneNumber?.phoneNumber || ""
	};
};
const parseTokensFromLocalizedString = (s, tokens) => {
	const expressions = (s.match(/{{.+?}}/g) || []).map((m) => m.replace(/[{}]/g, "")).map((m) => m.split("|").map((m) => m.trim())).filter((match) => Object.prototype.hasOwnProperty.call(tokens, match[0])).map(([token, ...modifiers]) => ({
		token,
		modifiers: modifiers.map((m) => getModifierWithParams(m)).filter((m) => assertKnownModifier(m.modifierName))
	}));
	let normalisedString = s;
	expressions.forEach(({ token }) => {
		normalisedString = normalisedString.replace(/{{.+?}}/, `_++${token}++_`);
	});
	return {
		expressions,
		normalisedString
	};
};
const applyTokenExpressions = (s, expressions, tokens) => {
	expressions.forEach(({ token, modifiers }) => {
		const value = modifiers.reduce((acc, mod) => {
			try {
				return MODIFIERS[mod.modifierName](acc, ...mod.params);
			} catch (e) {
				console.warn(e);
				return "";
			}
		}, tokens[token]);
		s = s.replace(`_++${token}++_`, value);
	});
	return s;
};
const assertKnownModifier = (s) => Object.prototype.hasOwnProperty.call(MODIFIERS, s);
const getModifierWithParams = (modifierExpression) => {
	const parts = modifierExpression.split(/[(,)]/g).map((m) => m.trim()).filter((m) => !!m);
	if (parts.length === 1) {
		const [modifierName] = parts;
		return {
			modifierName,
			params: []
		};
	} else {
		const [modifierName, ...params] = parts;
		return {
			modifierName,
			params: params.map((p) => p.replace(/['"]+/g, ""))
		};
	}
};

//#endregion
export { applyTokensToString, useGlobalTokens };
//# sourceMappingURL=applyTokensToString.js.map