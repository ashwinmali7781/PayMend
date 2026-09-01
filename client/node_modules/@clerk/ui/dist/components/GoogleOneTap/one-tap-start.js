import { useRouter } from "../../router/RouteContext.js";
import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useGoogleOneTapContext } from "../../contexts/components/GoogleOneTap.js";
import { withCardStateProvider } from "../../elements/contexts/index.js";
import { loadGIS } from "../../utils/one-tap.js";
import "@clerk/shared/internal/clerk-js/errors";
import { useEffect, useRef } from "react";
import { useClerk, useUser } from "@clerk/shared/react";

//#region src/components/GoogleOneTap/one-tap-start.tsx
function OneTapStartInternal() {
	const clerk = useClerk();
	const { user } = useUser();
	const environment = useEnvironment();
	const isPromptedRef = useRef(false);
	const { navigate } = useRouter();
	const ctx = useGoogleOneTapContext();
	async function oneTapCallback(response) {
		isPromptedRef.current = false;
		try {
			const res = await clerk.authenticateWithGoogleOneTap({ token: response.credential });
			await clerk.handleGoogleOneTapCallback(res, ctx.generateCallbackUrls(window.location.href), navigate);
		} catch (e) {
			console.error(e);
		}
	}
	const environmentClientID = environment.displayConfig.googleOneTapClientId;
	const shouldLoadGIS = !user?.id && !!environmentClientID;
	async function initializeGIS() {
		const google = await loadGIS();
		google.accounts.id.initialize({
			client_id: environmentClientID,
			callback: oneTapCallback,
			itp_support: ctx.itpSupport,
			cancel_on_tap_outside: ctx.cancelOnTapOutside,
			auto_select: false,
			use_fedcm_for_prompt: ctx.fedCmSupport
		});
		return google;
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