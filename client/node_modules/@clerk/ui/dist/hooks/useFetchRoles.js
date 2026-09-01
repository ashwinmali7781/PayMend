import { useFetch } from "./useFetch.js";
import { useProtect } from "../common/Gate.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { customRoleLocalizationKey, roleLocalizationKey } from "../utils/roleLocalizationKey.js";
import { useOrganization } from "@clerk/shared/react";

//#region src/hooks/useFetchRoles.ts
const getRolesParams = { 
/**
* Fetch at most 20 Roles, it is not expected for an app to have more.
* We also prevent the creation of more than 20 Roles in dashboard.
*/
pageSize: 20 };
const useFetchRoles = (enabled = true) => {
	const { organization } = useOrganization();
	const canManageMemberships = useProtect({ permission: "org:sys_memberships:manage" });
	const canReadMemberships = useProtect({ permission: "org:sys_memberships:read" });
	const getRoles = ({ pageSize, initialPage }) => organization.getRoles({
		pageSize,
		initialPage
	});
	const hasSystemPermissions = canManageMemberships || canReadMemberships;
	const { data, isLoading } = useFetch(enabled && !!organization?.id && hasSystemPermissions ? getRoles : void 0, {
		...getRolesParams,
		orgId: organization?.id
	});
	return {
		isLoading,
		hasRoleSetMigration: !!data?.has_role_set_migration,
		options: data?.data?.map((role) => ({
			value: role.key,
			label: role.name
		}))
	};
};
const useLocalizeCustomRoles = () => {
	const { t } = useLocalizations();
	return { localizeCustomRole: (param) => t(customRoleLocalizationKey(param)) || t(roleLocalizationKey(param)) };
};

//#endregion
export { useFetchRoles, useLocalizeCustomRoles };
//# sourceMappingURL=useFetchRoles.js.map