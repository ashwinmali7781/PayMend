import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { useUserProfileContext } from "../../contexts/components/UserProfile.js";
import { getSecondFactors } from "../../utils/mfa.js";
import { DeleteSection } from "./DeleteSection.js";
import { MfaSection } from "./MfaSection.js";
import { PasskeySection } from "./PasskeySection.js";
import { PasswordSection } from "./PasswordSection.js";
import { useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/SecuritySections.tsx
function SecurityPassword() {
	const { instanceIsPasswordBased } = useEnvironment().userSettings;
	if (!instanceIsPasswordBased) return null;
	return /* @__PURE__ */ jsx(PasswordSection, {});
}
function SecurityPasskeys() {
	const { attributes } = useEnvironment().userSettings;
	const { shouldAllowIdentificationCreation } = useUserProfileContext();
	if (!attributes.passkey?.enabled || !shouldAllowIdentificationCreation) return null;
	return /* @__PURE__ */ jsx(PasskeySection, {});
}
function SecurityMfa() {
	const { attributes } = useEnvironment().userSettings;
	if (getSecondFactors(attributes).length === 0) return null;
	return /* @__PURE__ */ jsx(MfaSection, {});
}
function SecurityDelete() {
	const { user } = useUser();
	if (!user?.deleteSelfEnabled) return null;
	return /* @__PURE__ */ jsx(DeleteSection, {});
}

//#endregion
export { SecurityDelete, SecurityMfa, SecurityPasskeys, SecurityPassword };
//# sourceMappingURL=SecuritySections.js.map