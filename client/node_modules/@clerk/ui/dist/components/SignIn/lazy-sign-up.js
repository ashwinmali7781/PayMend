import { lazy } from "react";

//#region src/components/SignIn/lazy-sign-up.ts
const preloadSignUp = () => import(
	/* webpackChunkName: "signup" */
	"../SignUp/index.js"
);
const LazySignUpVerifyPhone = lazy(() => preloadSignUp().then((m) => ({ default: m.SignUpVerifyPhone })));
const LazySignUpVerifyEmail = lazy(() => preloadSignUp().then((m) => ({ default: m.SignUpVerifyEmail })));
const LazySignUpStart = lazy(() => preloadSignUp().then((m) => ({ default: m.SignUpStart })));
const LazySignUpSSOCallback = lazy(() => preloadSignUp().then((m) => ({ default: m.SignUpSSOCallback })));
const LazySignUpContinue = lazy(() => preloadSignUp().then((m) => ({ default: m.SignUpContinue })));
const LazySignUpProtectCheck = lazy(() => preloadSignUp().then((m) => ({ default: m.SignUpProtectCheck })));
const lazyCompleteSignUpFlow = () => import(
	/* webpackChunkName: "signup" */
	"../SignUp/util.js"
).then((m) => m.completeSignUpFlow);

//#endregion
export { LazySignUpContinue, LazySignUpProtectCheck, LazySignUpSSOCallback, LazySignUpStart, LazySignUpVerifyEmail, LazySignUpVerifyPhone, lazyCompleteSignUpFlow, preloadSignUp };
//# sourceMappingURL=lazy-sign-up.js.map