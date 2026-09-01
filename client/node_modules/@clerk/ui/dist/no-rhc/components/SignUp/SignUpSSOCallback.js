import { SSOCallback } from "../../common/SSOCallback.js";
import { withRedirectToAfterSignUp, withRedirectToSignUpTask } from "../../common/withRedirect.js";

//#region src/components/SignUp/SignUpSSOCallback.tsx
const SignUpSSOCallback = withRedirectToSignUpTask(withRedirectToAfterSignUp(SSOCallback));

//#endregion
export { SignUpSSOCallback };
//# sourceMappingURL=SignUpSSOCallback.js.map