import { SSOCallback } from "../../common/SSOCallback.js";
import { withRedirectToAfterSignIn, withRedirectToSignInTask } from "../../common/withRedirect.js";

//#region src/components/SignIn/SignInSSOCallback.tsx
const SignInSSOCallback = withRedirectToSignInTask(withRedirectToAfterSignIn(SSOCallback));

//#endregion
export { SignInSSOCallback };
//# sourceMappingURL=SignInSSOCallback.js.map