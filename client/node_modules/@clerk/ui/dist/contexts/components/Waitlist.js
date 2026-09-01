import { useOptions } from "../OptionsContext.js";
import { useRouter } from "../../router/RouteContext.js";
import { getInitialValuesFromQueryParams } from "../utils.js";
import { useEnvironment } from "../EnvironmentContext.js";
import { createContext, useContext, useMemo } from "react";
import { buildURL } from "@clerk/shared/internal/clerk-js/url";

//#region src/contexts/components/Waitlist.ts
const WAITLIST_INITIAL_VALUE_KEYS = ["email_address"];
const WaitlistContext = createContext(null);
const useWaitlistContext = () => {
	const context = useContext(WaitlistContext);
	const { displayConfig } = useEnvironment();
	const options = useOptions();
	const { queryString } = useRouter();
	const initialValuesFromQueryParams = useMemo(() => getInitialValuesFromQueryParams(queryString, WAITLIST_INITIAL_VALUE_KEYS), []);
	if (!context || context.componentName !== "Waitlist") throw new Error("Clerk: useWaitlistContext called outside Waitlist.");
	const { componentName, ...ctx } = context;
	let signInUrl = ctx.signInUrl || options.signInUrl || displayConfig.signInUrl;
	signInUrl = buildURL({ base: signInUrl }, { stringify: true });
	return {
		...ctx,
		componentName,
		signInUrl,
		initialValues: { ...initialValuesFromQueryParams }
	};
};

//#endregion
export { WaitlistContext, useWaitlistContext };
//# sourceMappingURL=Waitlist.js.map