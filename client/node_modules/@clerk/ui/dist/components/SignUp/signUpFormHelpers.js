import { camelToSnake } from "@clerk/shared/underscore";

//#region src/components/SignUp/signUpFormHelpers.ts
const FieldKeys = [
	"emailAddress",
	"phoneNumber",
	"username",
	"firstName",
	"lastName",
	"password",
	"ticket",
	"legalAccepted"
];
function determineActiveFields(fieldProps) {
	return FieldKeys.reduce((fields, fieldKey) => {
		const field = getField(fieldKey, fieldProps);
		if (field) fields[fieldKey] = field;
		return fields;
	}, {});
}
function minimizeFieldsForExistingSignup(fields, signUp) {
	if (signUp) {
		const hasEmailFilled = !!signUp.emailAddress;
		const hasVerifiedEmail = signUp.verifications?.emailAddress?.status === "verified";
		const hasVerifiedPhone = signUp.verifications?.phoneNumber?.status === "verified";
		const hasVerifiedExternalAccount = signUp.verifications?.externalAccount?.status === "verified";
		const hasVerifiedWeb3Wallet = signUp.verifications?.web3Wallet?.status === "verified";
		const hasLegalAccepted = signUp.legalAcceptedAt !== null;
		if (hasEmailFilled && hasVerifiedEmail) delete fields.emailAddress;
		if (hasVerifiedPhone) delete fields.phoneNumber;
		if (hasVerifiedExternalAccount || hasVerifiedWeb3Wallet) delete fields.password;
		if (signUp.firstName) delete fields.firstName;
		if (signUp.lastName) delete fields.lastName;
		if (signUp.username) delete fields.username;
		if (hasLegalAccepted) delete fields.legalAccepted;
		Object.entries(fields).forEach(([k, v]) => {
			if (v && !v.required) delete fields[k];
		});
	}
}
const getInitialActiveIdentifier = (attributes, isProgressiveSignUp, initialValues) => {
	if (initialValues?.emailAddress) return "emailAddress";
	if (initialValues?.phoneNumber) return "phoneNumber";
	if (emailOrPhone(attributes, isProgressiveSignUp)) return "emailAddress";
	const { email_address, phone_number } = attributes;
	if (email_address?.enabled && isProgressiveSignUp ? email_address.required : email_address?.used_for_first_factor) return "emailAddress";
	if (phone_number?.enabled && isProgressiveSignUp ? phone_number.required : phone_number?.used_for_first_factor) return "phoneNumber";
	return null;
};
function showFormFields(userSettings) {
	const { authenticatableSocialStrategies, web3FirstFactors } = userSettings;
	return userSettings.hasValidAuthFactor || !authenticatableSocialStrategies.length && !web3FirstFactors.length;
}
function emailOrPhone(attributes, isProgressiveSignUp) {
	const { email_address, phone_number } = attributes;
	return Boolean(isProgressiveSignUp ? email_address?.enabled && phone_number?.enabled && !email_address.required && !phone_number.required : email_address?.used_for_first_factor && phone_number?.used_for_first_factor);
}
function getField(fieldKey, fieldProps) {
	switch (fieldKey) {
		case "emailAddress": return getEmailAddressField(fieldProps);
		case "phoneNumber": return getPhoneNumberField(fieldProps);
		case "password": return getPasswordField(fieldProps.attributes);
		case "ticket": return getTicketField(fieldProps.hasTicket);
		case "legalAccepted": return getLegalAcceptedField(fieldProps.legalConsentRequired);
		case "username":
		case "firstName":
		case "lastName": return getGenericField(fieldKey, fieldProps.attributes);
		default: return;
	}
}
function getEmailAddressField({ attributes, hasTicket, hasEmail, activeCommIdentifierType, isProgressiveSignUp }) {
	if (isProgressiveSignUp) {
		if (!((!hasTicket || hasTicket && hasEmail) && attributes.email_address?.enabled)) return;
		if (emailOrPhone(attributes, isProgressiveSignUp) && activeCommIdentifierType !== "emailAddress") return;
		const { emailShouldBeRequired } = determineRequiredIdentifier(attributes);
		return {
			required: emailShouldBeRequired,
			disabled: !!hasTicket && !!hasEmail
		};
	}
	if (!((!hasTicket || hasTicket && hasEmail) && attributes.email_address?.enabled && attributes.email_address?.used_for_first_factor && activeCommIdentifierType === "emailAddress")) return;
	return {
		required: true,
		disabled: !!hasTicket && !!hasEmail
	};
}
function getPhoneNumberField({ attributes, hasTicket, activeCommIdentifierType, isProgressiveSignUp }) {
	if (isProgressiveSignUp) {
		if (!attributes.phone_number?.enabled) return;
		if (emailOrPhone(attributes, isProgressiveSignUp) && activeCommIdentifierType !== "phoneNumber") return;
		const { phoneShouldBeRequired } = determineRequiredIdentifier(attributes);
		return { required: phoneShouldBeRequired };
	}
	if (!(!hasTicket && attributes.phone_number?.enabled && attributes.phone_number.used_for_first_factor && activeCommIdentifierType === "phoneNumber")) return;
	return { required: true };
}
function getPasswordField(attributes) {
	if (!(attributes.password?.enabled && attributes.password.required)) return;
	return { required: Boolean(attributes.password?.required) };
}
function getTicketField(hasTicket) {
	if (!hasTicket) return;
	return { required: true };
}
function getLegalAcceptedField(legalConsentRequired) {
	if (!legalConsentRequired) return;
	return { required: true };
}
function getGenericField(fieldKey, attributes) {
	const attrKey = camelToSnake(fieldKey);
	if (!attributes[attrKey]?.enabled) return;
	return { required: attributes[attrKey]?.required };
}
const outcomePredicates = {
	mirrorServer: [(ctx) => !ctx.passwordRequired, (ctx) => ctx.email.required || ctx.phone.required || ctx.username.required && ctx.username.firstFactor],
	none: [(ctx) => !ctx.email.enabled && !ctx.phone.enabled && !ctx.username.enabled],
	email: [
		(ctx) => ctx.email.enabled && !ctx.phone.enabled && !ctx.username.enabled,
		(ctx) => ctx.email.enabled && !ctx.email.required && ctx.phone.enabled && !ctx.phone.required,
		(ctx) => ctx.username.firstFactor && !ctx.username.required && ctx.email.enabled && !ctx.email.required,
		(ctx) => ctx.username.required && !ctx.username.firstFactor && ctx.email.enabled && ctx.phone.enabled
	],
	phone: [
		(ctx) => ctx.phone.enabled && !ctx.email.required && !ctx.phone.required,
		(ctx) => ctx.username.firstFactor && !ctx.username.required && ctx.phone.enabled && !ctx.phone.required,
		(ctx) => ctx.phone.firstFactor && !ctx.email.firstFactor && !ctx.username.firstFactor,
		(ctx) => ctx.username.required && !ctx.username.firstFactor && ctx.phone.enabled && ctx.email.enabled,
		(ctx) => !ctx.email.enabled && ctx.phone.enabled && ctx.username.enabled
	],
	username: [(ctx) => ctx.username.enabled && ctx.username.firstFactor && !ctx.email.enabled && !ctx.phone.enabled, (ctx) => ctx.username.required && !ctx.username.firstFactor && ctx.email.enabled && ctx.phone.enabled]
};
/**
* When password is required, we need to ensure at least one identifier
* (email, phone, or username) is also required
*/
function determineRequiredIdentifier(attributes) {
	const ctx = {
		passwordRequired: Boolean(attributes.password?.enabled && attributes.password.required),
		email: {
			enabled: Boolean(attributes.email_address?.enabled),
			required: Boolean(attributes.email_address?.required),
			firstFactor: Boolean(attributes.email_address?.used_for_first_factor)
		},
		phone: {
			enabled: Boolean(attributes.phone_number?.enabled),
			required: Boolean(attributes.phone_number?.required),
			firstFactor: Boolean(attributes.phone_number?.used_for_first_factor)
		},
		username: {
			enabled: Boolean(attributes.username?.enabled),
			required: Boolean(attributes.username?.required),
			firstFactor: Boolean(attributes.username?.used_for_first_factor)
		}
	};
	const outcomeMet = (outcome) => outcomePredicates[outcome].some((predicate) => predicate(ctx));
	if (outcomeMet("mirrorServer")) return {
		emailShouldBeRequired: ctx.email.required,
		phoneShouldBeRequired: ctx.phone.required,
		usernameShouldBeRequired: ctx.username.required
	};
	if (outcomeMet("none")) return {
		emailShouldBeRequired: false,
		phoneShouldBeRequired: false,
		usernameShouldBeRequired: false
	};
	const emailShouldBeRequired = outcomeMet("email");
	const phoneShouldBeRequired = outcomeMet("phone");
	const usernameShouldBeRequired = outcomeMet("username");
	if (ctx.passwordRequired && !emailShouldBeRequired && !phoneShouldBeRequired && !usernameShouldBeRequired) return {
		emailShouldBeRequired: true,
		phoneShouldBeRequired: false,
		usernameShouldBeRequired: false
	};
	return {
		emailShouldBeRequired,
		phoneShouldBeRequired,
		usernameShouldBeRequired
	};
}

//#endregion
export { determineActiveFields, emailOrPhone, getInitialActiveIdentifier, minimizeFieldsForExistingSignup, showFormFields };
//# sourceMappingURL=signUpFormHelpers.js.map