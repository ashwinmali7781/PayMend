import { useFetch } from "../../hooks/useFetch.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSignUpContext } from "../../contexts/components/SignUp.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { LoadingCard } from "../../elements/LoadingCard.js";
import { withRedirectToAfterSignUp } from "../../common/withRedirect.js";
import { ChooseEnterpriseConnectionCard } from "../../common/ChooseEnterpriseConnectionCard.js";
import { jsx } from "@emotion/react/jsx-runtime";
import { useClerk } from "@clerk/shared/react/index";

//#region src/components/SignUp/SignUpEnterpriseConnections.tsx
const SignUpEnterpriseConnectionsInternal = () => {
	const clerk = useClerk();
	const ctx = useSignUpContext();
	const signUp = clerk.client.signUp;
	const { data: enterpriseConnections, isLoading } = useFetch(signUp?.__experimental_getEnterpriseConnections, { signUpId: signUp.id });
	const handleEnterpriseSSO = (enterpriseConnectionId) => {
		const redirectUrl = ctx.ssoCallbackUrl;
		const redirectUrlComplete = ctx.afterSignUpUrl || "/";
		return signUp.authenticateWithRedirect({
			strategy: "enterprise_sso",
			redirectUrl,
			redirectUrlComplete,
			continueSignUp: true,
			enterpriseConnectionId
		});
	};
	if (!isLoading && !enterpriseConnections?.length) return null;
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "enterpriseConnections",
		children: enterpriseConnections?.length ? /* @__PURE__ */ jsx(ChooseEnterpriseConnectionCard, {
			title: localizationKeys("signUp.enterpriseConnections.title"),
			subtitle: localizationKeys("signUp.enterpriseConnections.subtitle"),
			onClick: handleEnterpriseSSO,
			enterpriseConnections
		}) : isLoading ? /* @__PURE__ */ jsx(LoadingCard, {}) : null
	});
};
/**
* @experimental
*/
const SignUpEnterpriseConnections = withRedirectToAfterSignUp(withCardStateProvider(SignUpEnterpriseConnectionsInternal));

//#endregion
export { SignUpEnterpriseConnections };
//# sourceMappingURL=SignUpEnterpriseConnections.js.map