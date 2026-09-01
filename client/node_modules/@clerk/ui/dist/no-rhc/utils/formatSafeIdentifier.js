import { stringToFormattedPhoneString } from "./phoneUtils.js";

//#region src/utils/formatSafeIdentifier.ts
const isMaskedIdentifier = (str) => str && str.includes("**");
/**
* Formats a string that can contain an email, a username or a phone number.
* Depending on the scenario, the string might be obfuscated (parts of the identifier replaced with "*")
* Refer to the tests for examples.
*/
const formatSafeIdentifier = (str) => {
	if (!str || str.includes("@") || isMaskedIdentifier(str) || str.match(/[a-zA-Z]/) || !str.startsWith("+")) return str;
	return stringToFormattedPhoneString(str);
};

//#endregion
export { formatSafeIdentifier, isMaskedIdentifier };
//# sourceMappingURL=formatSafeIdentifier.js.map