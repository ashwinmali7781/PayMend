import { useOptions } from "../contexts/OptionsContext.js";
import { useRouter } from "../router/RouteContext.js";
import { useEnvironment } from "../contexts/EnvironmentContext.js";
import { useSignInContext } from "../contexts/components/SignIn.js";
import { useSignUpContext } from "../contexts/components/SignUp.js";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";
import { isSignedInAndSingleSessionModeEnabled } from "@clerk/shared/internal/clerk-js/componentGuards";
import { warnings } from "@clerk/shared/internal/clerk-js/warnings";
import { isDevelopmentFromPublishableKey } from "@clerk/shared/keys";

//#region src/common/withRedirect.tsx
function withRedirect(Component, condition, redirectUrl, warning) {
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	const HOC = (props) => {
		const { navigate } = useRouter();
		const clerk = useClerk();
		const environment = useEnvironment();
		const options = useOptions();
		const shouldRedirect = condition(clerk, environment, options);
		React.useEffect(() => {
			if (shouldRedirect) {
				if (warning && isDevelopmentFromPublishableKey(clerk.publishableKey)) console.info(warning);
				navigate(redirectUrl({
					clerk,
					environment,
					options
				}));
			}
		}, []);
		if (shouldRedirect) return null;
		return /* @__PURE__ */ jsx(Component, { ...props });
	};
	HOC.displayName = `withRedirect(${displayName})`;
	return HOC;
}
const withRedirectToAfterSignIn = (Component) => {
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	const HOC = (props) => {
		const signInCtx = useSignInContext();
		return withRedirect(Component, isSignedInAndSingleSessionModeEnabled, ({ clerk }) => signInCtx.afterSignInUrl || clerk.buildAfterSignInUrl(), warnings.cannotRenderSignInComponentWhenSessionExists)(props);
	};
	HOC.displayName = `withRedirectToAfterSignIn(${displayName})`;
	return HOC;
};
const withRedirectToAfterSignUp = (Component) => {
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	const HOC = (props) => {
		const signUpCtx = useSignUpContext();
		return withRedirect(Component, isSignedInAndSingleSessionModeEnabled, ({ clerk }) => signUpCtx.afterSignUpUrl || clerk.buildAfterSignUpUrl(), warnings.cannotRenderSignUpComponentWhenSessionExists)(props);
	};
	HOC.displayName = `withRedirectToAfterSignUp(${displayName})`;
	return HOC;
};
const withRedirectToSignInTask = (Component) => {
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	const HOC = (props) => {
		const signInCtx = useSignInContext();
		return withRedirect(Component, (clerk, environment) => !!environment?.authConfig.singleSessionMode && !!(clerk.session?.currentTask && signInCtx?.taskUrl), () => signInCtx.taskUrl, void 0)(props);
	};
	HOC.displayName = `withRedirectToSignInTask(${displayName})`;
	return HOC;
};
const withRedirectToSignUpTask = (Component) => {
	const displayName = Component.displayName || Component.name || "Component";
	Component.displayName = displayName;
	const HOC = (props) => {
		const signUpCtx = useSignUpContext();
		return withRedirect(Component, (clerk, environment) => !!environment?.authConfig.singleSessionMode && !!(clerk.session?.currentTask && signUpCtx?.taskUrl), () => signUpCtx.taskUrl, void 0)(props);
	};
	HOC.displayName = `withRedirectToSignUpTask(${displayName})`;
	return HOC;
};

//#endregion
export { withRedirect, withRedirectToAfterSignIn, withRedirectToAfterSignUp, withRedirectToSignInTask, withRedirectToSignUpTask };
//# sourceMappingURL=withRedirect.js.map