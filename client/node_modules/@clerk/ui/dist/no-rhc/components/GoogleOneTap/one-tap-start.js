import { useRouter } from "../../router/RouteContext.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useGoogleOneTapContext } from "../../contexts/components/GoogleOneTap.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { clerkUnsupportedEnvironmentWarning } from "@clerk/shared/internal/clerk-js/errors";
import { useEffect, useRef } from "react";
import { useClerk, useUser } from "@clerk/shared/react";

//#region src/components/GoogleOneTap/one-tap-start.tsx
function OneTapStartInternal() {
	const clerk = useClerk();
	const { user } = useUser();
	const environment = useEnvironment();
	const isPromptedRef = useRef(false);
	const { navigate } = useRouter();
	useGoogleOneTapContext();
	const environmentClientID = environment.displayConfig.googleOneTapClientId;
	const shouldLoadGIS = !user?.id && !!environmentClientID;
	async function initializeGIS() {
		clerkUnsupportedEnvironmentWarning("Google Identity Services");
	}
	/**
	* Prevent GIS from initializing multiple times
	*/
	const { data: initializedGoogle } = useFetch(shouldLoadGIS ? initializeGIS : void 0, "google-identity-services-script");
	useEffect(() => {
		if (initializedGoogle && !user?.id && !isPromptedRef.current) {
			initializedGoogle.accounts.id.prompt((notification) => {
				if (notification.getMomentType() === "skipped") clerk.closeGoogleOneTap();
			});
			isPromptedRef.current = true;
		}
	}, [
		clerk,
		initializedGoogle,
		user?.id
	]);
	useEffect(() => {
		return () => {
			if (initializedGoogle && isPromptedRef.current) {
				isPromptedRef.current = false;
				initializedGoogle.accounts.id.cancel();
			}
		};
	}, [initializedGoogle]);
	return null;
}
const OneTapStart = withCardStateProvider(OneTapStartInternal);

//#endregion
export { OneTapStart };
//# sourceMappingURL=one-tap-start.js.map