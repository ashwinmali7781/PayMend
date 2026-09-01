import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { useUserProfileContext } from "../../contexts/components/UserProfile.js";
import { isAttributeAvailable } from "./utils.js";
import { ConnectedAccountsSection } from "./ConnectedAccountsSection.js";
import { EmailsSection } from "./EmailsSection.js";
import { EnterpriseAccountsSection } from "./EnterpriseAccountsSection.js";
import { PhoneSection } from "./PhoneSection.js";
import { UsernameSection } from "./UsernameSection.js";
import { Web3Section } from "./Web3Section.js";
import { useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/AccountSections.tsx
function AccountUsername() {
	const { attributes } = useEnvironment().userSettings;
	const { immutableAttributes } = useUserProfileContext();
	if (!isAttributeAvailable(attributes.username)) return null;
	return /* @__PURE__ */ jsx(UsernameSection, { isImmutable: immutableAttributes.has("username") });
}
function AccountEmails() {
	const { attributes } = useEnvironment().userSettings;
	const { shouldAllowIdentificationCreation, immutableAttributes } = useUserProfileContext();
	if (!isAttributeAvailable(attributes.email_address)) return null;
	const isImmutable = immutableAttributes.has("email_address");
	return /* @__PURE__ */ jsx(EmailsSection, {
		shouldAllowCreation: shouldAllowIdentificationCreation && !isImmutable,
		shouldAllowDeletion: !isImmutable
	});
}
function AccountPhone() {
	const { attributes } = useEnvironment().userSettings;
	const { shouldAllowIdentificationCreation, immutableAttributes } = useUserProfileContext();
	if (!isAttributeAvailable(attributes.phone_number)) return null;
	const isImmutable = immutableAttributes.has("phone_number");
	return /* @__PURE__ */ jsx(PhoneSection, {
		shouldAllowCreation: shouldAllowIdentificationCreation && !isImmutable,
		shouldAllowDeletion: !isImmutable
	});
}
function AccountConnectedAccounts() {
	const { social } = useEnvironment().userSettings;
	const { shouldAllowIdentificationCreation } = useUserProfileContext();
	if (!social || Object.values(social).filter((p) => p.enabled).length === 0) return null;
	return /* @__PURE__ */ jsx(ConnectedAccountsSection, { shouldAllowCreation: shouldAllowIdentificationCreation });
}
function AccountEnterpriseAccounts() {
	const { enterpriseSSO } = useEnvironment().userSettings;
	const { user } = useUser();
	if (!user || !enterpriseSSO.enabled) return null;
	return /* @__PURE__ */ jsx(EnterpriseAccountsSection, {});
}
function AccountWeb3() {
	const { attributes } = useEnvironment().userSettings;
	const { shouldAllowIdentificationCreation } = useUserProfileContext();
	if (!attributes.web3_wallet?.enabled) return null;
	return /* @__PURE__ */ jsx(Web3Section, { shouldAllowCreation: shouldAllowIdentificationCreation });
}

//#endregion
export { AccountConnectedAccounts, AccountEmails, AccountEnterpriseAccounts, AccountPhone, AccountUsername, AccountWeb3 };
//# sourceMappingURL=AccountSections.js.map