import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { SignUpEmailCodeCard } from "./SignUpEmailCodeCard.js";
import { SignUpEmailLinkCard } from "./SignUpEmailLinkCard.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/SignUp/SignUpVerifyEmail.tsx
const SignUpVerifyEmail = withCardStateProvider(() => {
	const { userSettings } = useEnvironment();
	const { attributes } = userSettings;
	return attributes.email_address?.verifications?.includes("email_link") ? /* @__PURE__ */ jsx(SignUpEmailLinkCard, {}) : /* @__PURE__ */ jsx(SignUpEmailCodeCard, {});
});

//#endregion
export { SignUpVerifyEmail };
//# sourceMappingURL=SignUpVerifyEmail.js.map