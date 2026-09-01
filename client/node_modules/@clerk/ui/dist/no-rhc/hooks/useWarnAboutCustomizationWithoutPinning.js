import { warnAboutComponentAppearance } from "../utils/warnAboutCustomizationWithoutPinning.js";
import { OptionsContext as OptionsContext$1 } from "../contexts/OptionsContext.js";
import { useContext, useEffect } from "react";
import { ClerkInstanceContext, OptionsContext, useDeepEqualMemo } from "@clerk/shared/react";

//#region src/hooks/useWarnAboutCustomizationWithoutPinning.ts
/**
* Hook that checks component-level appearance for structural CSS patterns
* and warns if found (when version is not pinned).
*
* This is called when individual components mount with their own appearance,
* to catch structural CSS that wasn't passed through ClerkProvider.
*
* Only runs in development mode.
*
* Note: This hook is safe to use outside of ClerkProvider context (e.g., in tests)
* - it will simply not perform any checks in that case.
*/
function useWarnAboutCustomizationWithoutPinning(appearance) {
	const clerkCtx = useContext(ClerkInstanceContext);
	const localOptions = useContext(OptionsContext$1);
	const sharedOptions = useContext(OptionsContext);
	const uiPinned = !!(localOptions ?? sharedOptions)?.ui;
	const stableAppearance = useDeepEqualMemo(() => appearance, [appearance]);
	useEffect(() => {
		if (!clerkCtx?.value) return;
		if (clerkCtx.value.instanceType !== "development") return;
		const useIdleCallback = typeof requestIdleCallback === "function";
		const handle = useIdleCallback ? requestIdleCallback(() => warnAboutComponentAppearance(stableAppearance, uiPinned)) : setTimeout(() => warnAboutComponentAppearance(stableAppearance, uiPinned), 0);
		return () => {
			if (useIdleCallback) cancelIdleCallback(handle);
			else clearTimeout(handle);
		};
	}, [
		clerkCtx?.value,
		stableAppearance,
		uiPinned
	]);
}

//#endregion
export { useWarnAboutCustomizationWithoutPinning };
//# sourceMappingURL=useWarnAboutCustomizationWithoutPinning.js.map