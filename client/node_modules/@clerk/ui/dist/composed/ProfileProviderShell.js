'use client';

import { extractCssLayerNameFromAppearance } from "../utils/extractCssLayerNameFromAppearance.js";
import { OptionsProvider } from "../contexts/OptionsContext.js";
import { RouteContext } from "../router/RouteContext.js";
import { EnvironmentProvider } from "../contexts/EnvironmentContext.js";
import { ModuleManagerProvider } from "../contexts/ModuleManagerContext.js";
import { AppearanceProvider } from "../customizables/AppearanceContext.js";
import { InternalThemeProvider } from "../styledSystem/InternalThemeProvider.js";
import { FlowMetadataProvider } from "../elements/contexts/index.js";
import { getStyleCacheEntry, setStyleCache } from "../internal/styleCacheStore.js";
import { createEmotionCache } from "../styledSystem/createEmotionCache.js";
import { AppearanceOverrides } from "../elements/AppearanceOverrides.js";
import { createComposedRouter } from "./stubRouter.js";
import { ClerkRuntimeError } from "@clerk/shared/error";
import { logger } from "@clerk/shared/logger";
import { useMemo } from "react";
import { jsx } from "@emotion/react/jsx-runtime";
import { CacheProvider } from "@emotion/react";

//#region src/composed/ProfileProviderShell.tsx
const fallbackModuleManager = { import: () => Promise.reject(new ClerkRuntimeError("Composed profile components could not resolve a Clerk module manager: this Clerk instance does not expose one. This usually means the loaded @clerk/clerk-js is too old to support composed profiles.", { code: "composed_module_manager_unavailable" })) };
/**
* Resolves the clerk-js runtime state (environment + module manager) that the
* composed profile shell needs. Composed UI is bundled into the consumer app but
* clerk-js is hotloaded separately, so an app can bundle composed components that
* are newer than the loaded clerk-js. `moduleManager` falls back to a loud stub;
* `environment` can only be absent, so once clerk has finished loading a missing
* runtime is a real version mismatch and gets a one-time warning instead of a
* silent blank render.
*/
function resolveComposedClerkRuntime(clerk, clerkLoaded) {
	const environment = clerk.__internal_environment;
	const moduleManager = clerk.__internal_moduleManager ?? fallbackModuleManager;
	if (clerkLoaded && (!environment || clerk.__internal_moduleManager === void 0)) logger.warnOnce("Clerk: Composed profile components could not read the runtime state (environment/module manager) from the loaded @clerk/clerk-js, so nothing will render. This usually means the loaded clerk-js is older than the composed components bundled in your app. Upgrade @clerk/clerk-js (or your framework SDK) to a version that supports composed profiles.");
	return {
		environment,
		moduleManager
	};
}
function readNonceOption(clerk) {
	return clerk.__internal_getOption("nonce");
}
const composedOverrides = { profilePageContent: { padding: 0 } };
function SharedStyleCacheProvider({ clerk, nonce, cssLayerName, children }) {
	return /* @__PURE__ */ jsx(CacheProvider, {
		value: useMemo(() => {
			const existing = getStyleCacheEntry(clerk);
			if (existing && existing.nonce === nonce && existing.cssLayerName === cssLayerName) return existing.cache;
			const next = createEmotionCache({
				nonce,
				cssLayerName
			});
			setStyleCache(clerk, {
				cache: next,
				nonce,
				cssLayerName
			});
			return next;
		}, [
			clerk,
			nonce,
			cssLayerName
		]),
		children
	});
}
function ProfileProviderShell({ children, clerk, environment, moduleManager, appearanceKey, flow, globalAppearance, appearance }) {
	const router = useMemo(() => createComposedRouter(clerk.navigate), [clerk]);
	const normalizedGlobalAppearance = useMemo(() => extractCssLayerNameFromAppearance(globalAppearance), [globalAppearance]);
	const options = useMemo(() => ({
		localization: clerk.__internal_getOption("localization"),
		supportEmail: clerk.__internal_getOption("supportEmail")
	}), [clerk]);
	return /* @__PURE__ */ jsx(SharedStyleCacheProvider, {
		clerk,
		nonce: readNonceOption(clerk),
		cssLayerName: normalizedGlobalAppearance?.cssLayerName,
		children: /* @__PURE__ */ jsx(AppearanceProvider, {
			appearanceKey,
			globalAppearance: normalizedGlobalAppearance,
			appearance,
			children: /* @__PURE__ */ jsx(FlowMetadataProvider, {
				flow,
				children: /* @__PURE__ */ jsx(InternalThemeProvider, { children: /* @__PURE__ */ jsx(ModuleManagerProvider, {
					moduleManager,
					children: /* @__PURE__ */ jsx(OptionsProvider, {
						value: options,
						children: /* @__PURE__ */ jsx(EnvironmentProvider, {
							value: environment,
							children: /* @__PURE__ */ jsx(RouteContext.Provider, {
								value: router,
								children: /* @__PURE__ */ jsx(AppearanceOverrides, {
									elements: composedOverrides,
									children
								})
							})
						})
					})
				}) })
			})
		})
	});
}

//#endregion
export { ProfileProviderShell, resolveComposedClerkRuntime };
//# sourceMappingURL=ProfileProviderShell.js.map