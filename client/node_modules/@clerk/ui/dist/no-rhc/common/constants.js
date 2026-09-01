import { localizationKeys } from "../localization/localizationKeys.js";

//#region src/common/constants.ts
const FirstFactorConfigs = Object.freeze({
	email_address_username: {
		label: localizationKeys("formFieldLabel__emailAddress_username"),
		placeholder: localizationKeys("formFieldInputPlaceholder__emailAddress_username"),
		type: "text",
		action: localizationKeys("signIn.start.actionLink__use_email_username"),
		validLastAuthenticationStrategies: new Set([
			"email_code",
			"email_link",
			"email_address",
			"username",
			"password"
		])
	},
	email_address: {
		label: localizationKeys("formFieldLabel__emailAddress"),
		placeholder: localizationKeys("formFieldInputPlaceholder__emailAddress"),
		type: "email",
		action: localizationKeys("signIn.start.actionLink__use_email"),
		validLastAuthenticationStrategies: new Set([
			"email_code",
			"email_link",
			"email_address",
			"password"
		])
	},
	phone_number: {
		label: localizationKeys("formFieldLabel__phoneNumber"),
		placeholder: localizationKeys("formFieldInputPlaceholder__phoneNumber"),
		type: "tel",
		action: localizationKeys("signIn.start.actionLink__use_phone"),
		validLastAuthenticationStrategies: new Set(["phone_code", "password"])
	},
	username: {
		label: localizationKeys("formFieldLabel__username"),
		placeholder: localizationKeys("formFieldInputPlaceholder__username"),
		type: "text",
		action: localizationKeys("signIn.start.actionLink__use_username"),
		validLastAuthenticationStrategies: new Set(["username", "password"])
	},
	default: {
		label: "",
		placeholder: "",
		type: "text",
		action: "",
		validLastAuthenticationStrategies: /* @__PURE__ */ new Set()
	}
});
const groupIdentifiers = (attributes) => {
	let newAttributes = [...attributes.filter((a) => a !== "passkey")];
	if (["email_address", "username"].every((r) => newAttributes.includes(r))) {
		newAttributes = newAttributes.filter((a) => !["email_address", "username"].includes(a));
		newAttributes.unshift("email_address_username");
	}
	return newAttributes;
};
const getIdentifierControlDisplayValues = (identifiers, identifier) => {
	const index = identifiers.indexOf(identifier);
	if (index === -1) return {
		currentIdentifier: { ...FirstFactorConfigs["default"] },
		nextIdentifier: void 0
	};
	return {
		currentIdentifier: { ...FirstFactorConfigs[identifier] },
		nextIdentifier: identifiers.length > 1 ? { ...FirstFactorConfigs[identifiers[(index + 1) % identifiers.length]] } : void 0
	};
};
const PREFERRED_SIGN_IN_STRATEGIES = Object.freeze({
	Password: "password",
	OTP: "otp"
});

//#endregion
export { PREFERRED_SIGN_IN_STRATEGIES, getIdentifierControlDisplayValues, groupIdentifiers };
//# sourceMappingURL=constants.js.map