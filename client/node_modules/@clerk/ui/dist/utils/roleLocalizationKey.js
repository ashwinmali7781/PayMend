import { localizationKeys } from "../localization/localizationKeys.js";

//#region src/utils/roleLocalizationKey.ts
const roleToLocalizationKey = {
	/**
	* These are old role keys. We still need to support localization for those to avoid breaking labels in UI components for old instances.
	*/
	basic_member: localizationKeys("membershipRole__basicMember"),
	guest_member: localizationKeys("membershipRole__guestMember"),
	admin: localizationKeys("membershipRole__admin")
};
const roleLocalizationKey = (role) => {
	if (!role) return;
	return roleToLocalizationKey[role];
};
const customRoleLocalizationKey = (role) => {
	if (!role) return;
	return localizationKeys(`roles.${role}`);
};

//#endregion
export { customRoleLocalizationKey, roleLocalizationKey };
//# sourceMappingURL=roleLocalizationKey.js.map