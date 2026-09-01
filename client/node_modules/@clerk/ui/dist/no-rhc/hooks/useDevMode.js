import { useEnvironment } from "../contexts/EnvironmentContext.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { useMemo } from "react";

//#region src/hooks/useDevMode.tsx
function useDevMode() {
	const { displayConfig, isDevelopmentOrStaging } = useEnvironment();
	const isDevelopment = isDevelopmentOrStaging();
	const { unsafe_disableDevelopmentModeWarnings = false } = useAppearance().parsedOptions;
	const developmentUiDisabled = isDevelopment && unsafe_disableDevelopmentModeWarnings;
	return { showDevModeNotice: useMemo(() => !developmentUiDisabled && displayConfig.showDevModeWarning, [developmentUiDisabled, displayConfig]) };
}

//#endregion
export { useDevMode };
//# sourceMappingURL=useDevMode.js.map