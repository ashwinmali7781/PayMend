import React from "react";

//#region src/components/ConfigureSSO/elements/Wizard/WizardContext.tsx
const WizardContext = React.createContext(null);
WizardContext.displayName = "WizardContext";
/**
* The wizard navigation facade. Consumers (step bodies, footers, the
* breadcrumb) read only this — `goNext`/`goPrev`/`goToStep` plus the derived
* `current`/`activeSteps`/`isFirstStep`/`isLastStep`. The underlying state
* machine is an internal detail of `<Wizard>` and is never exposed.
*/
function useWizard() {
	const ctx = React.useContext(WizardContext);
	if (!ctx) throw new Error("useWizard called outside of <Wizard>");
	return ctx;
}

//#endregion
export { WizardContext, useWizard };
//# sourceMappingURL=WizardContext.js.map