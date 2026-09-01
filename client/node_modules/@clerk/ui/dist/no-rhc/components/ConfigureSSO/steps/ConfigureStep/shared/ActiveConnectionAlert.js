import { localizationKeys } from "../../../../../localization/localizationKeys.js";
import { Alert } from "../../../../../elements/Alert.js";
import { useConfigureSSO } from "../../../ConfigureSSOContext.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/steps/ConfigureStep/shared/ActiveConnectionAlert.tsx
const ActiveConnectionAlert = () => {
	const { enterpriseConnection } = useConfigureSSO();
	const [isDismissed, setIsDismissed] = React.useState(false);
	if (!enterpriseConnection?.active || isDismissed) return null;
	return /* @__PURE__ */ jsx(Alert, {
		variant: "warning",
		title: localizationKeys("configureSSO.configureStep.activeConnectionWarning.title"),
		dismissLabel: localizationKeys("configureSSO.configureStep.activeConnectionWarning.dismiss"),
		onDismiss: () => setIsDismissed(true)
	});
};

//#endregion
export { ActiveConnectionAlert };
//# sourceMappingURL=ActiveConnectionAlert.js.map