import { localizationKeys } from "../localization/localizationKeys.js";
import { withCardStateProvider } from "../elements/contexts/index.js";
import { EmailLinkVerify } from "./EmailLinkVerify.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/common/EmailLinkCompleteFlowCard.tsx
const signInLocalizationKeys = {
	verified: {
		title: localizationKeys("signIn.emailLink.verified.title"),
		subtitle: localizationKeys("signIn.emailLink.verified.subtitle")
	},
	verified_switch_tab: {
		title: localizationKeys("signIn.emailLink.verified.title"),
		subtitle: localizationKeys("signIn.emailLink.verifiedSwitchTab.subtitle")
	},
	transferable: {
		title: localizationKeys("signIn.emailLink.verifiedTransferable.title"),
		subtitle: localizationKeys("signIn.emailLink.verifiedTransferable.subtitle")
	},
	loading: {
		title: localizationKeys("signIn.emailLink.loading.title"),
		subtitle: localizationKeys("signIn.emailLink.loading.subtitle")
	},
	failed: {
		title: localizationKeys("signIn.emailLink.failed.title"),
		subtitle: localizationKeys("signIn.emailLink.failed.subtitle")
	},
	expired: {
		title: localizationKeys("signIn.emailLink.expired.title"),
		subtitle: localizationKeys("signIn.emailLink.expired.subtitle")
	},
	client_mismatch: {
		title: localizationKeys("signIn.emailLink.clientMismatch.title"),
		subtitle: localizationKeys("signIn.emailLink.clientMismatch.subtitle")
	}
};
const signUpLocalizationKeys = {
	...signInLocalizationKeys,
	verified: {
		...signInLocalizationKeys.verified,
		title: localizationKeys("signUp.emailLink.verified.title")
	},
	verified_switch_tab: {
		...signInLocalizationKeys.verified_switch_tab,
		title: localizationKeys("signUp.emailLink.verified.title")
	},
	loading: {
		...signInLocalizationKeys.loading,
		title: localizationKeys("signUp.emailLink.loading.title")
	},
	client_mismatch: {
		...signInLocalizationKeys.client_mismatch,
		subtitle: localizationKeys("signUp.emailLink.clientMismatch.subtitle")
	}
};
const SignInEmailLinkFlowComplete = withCardStateProvider((props) => {
	return /* @__PURE__ */ jsx(EmailLinkVerify, {
		...props,
		texts: signInLocalizationKeys
	});
});
const SignUpEmailLinkFlowComplete = withCardStateProvider((props) => {
	return /* @__PURE__ */ jsx(EmailLinkVerify, {
		...props,
		texts: signUpLocalizationKeys
	});
});

//#endregion
export { SignInEmailLinkFlowComplete, SignUpEmailLinkFlowComplete };
//# sourceMappingURL=EmailLinkCompleteFlowCard.js.map