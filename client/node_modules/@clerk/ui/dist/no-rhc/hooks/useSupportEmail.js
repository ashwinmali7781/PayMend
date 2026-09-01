import { useOptions } from "../contexts/OptionsContext.js";
import { useEnvironment } from "../contexts/EnvironmentContext.js";
import React from "react";
import { useClerk } from "@clerk/shared/react";
import { buildEmailAddress } from "@clerk/shared/internal/clerk-js/email";

//#region src/hooks/useSupportEmail.ts
function useSupportEmail() {
	const Clerk = useClerk();
	const { supportEmail: supportEmailFromOptions } = useOptions();
	const { displayConfig } = useEnvironment();
	const { supportEmail: supportEmailFromEnvironment } = displayConfig;
	return React.useMemo(() => supportEmailFromOptions || supportEmailFromEnvironment || buildEmailAddress({
		localPart: "support",
		frontendApi: Clerk.frontendApi
	}), [
		Clerk.frontendApi,
		supportEmailFromOptions,
		supportEmailFromEnvironment
	]);
}

//#endregion
export { useSupportEmail };
//# sourceMappingURL=useSupportEmail.js.map