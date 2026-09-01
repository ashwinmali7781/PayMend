import { useWizardMachine } from "./useWizardMachine.js";
import { WizardContext, useWizard } from "./WizardContext.js";
import React from "react";
import { Fragment as Fragment$1, jsx } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/elements/Wizard/Wizard.tsx
/**
* Generic, declarative, UI-less wizard primitive.
*
* Steps are a body-less config array (`steps`): each entry is one navigable
* position with an `id` + optional inline `isReachable` / `label`. The graph IS
* the array — known synchronously, no `React.Children` walking, no effect-timed
* registration — and feeds a domain-agnostic machine in the same render pass.
* Rendering lives in `children`: chrome is a normal child, each step body is a
* render-only `<Wizard.Match id>`.
*
* The machine is hidden behind `useWizard()`. Conditional flow is expressed by
* each step's inline `isReachable` (applied uniformly by init / nav / stepper);
* steps are never added or removed, only gated. Inner sub-flows nest another
* `<Wizard>` whose forward boundary falls through to the parent (a nested
* last-step `goNext` advances the parent). An isReachable-blocked mid-flow
* `goNext` does not hard-stop: it parks a deferred advance that resolves once
* the next step becomes reachable while still on the step (abandoned by an
* explicit `goPrev`/`goToStep`).
*/
const WizardRoot = ({ steps, initialStepId, children }) => {
	const parentWizard = React.useContext(WizardContext);
	const value = useWizardMachine({
		config: React.useMemo(() => ({ descriptors: steps }), [steps]),
		parentWizard,
		initialStepId
	});
	return /* @__PURE__ */ jsx(WizardContext.Provider, {
		value,
		children
	});
};
/**
* Render-only branch: renders `children` only when the active step matches `id`,
* else `null`. It does NOT register a step or build the graph (the `steps` array
* already did).
*/
const Match = ({ id, children }) => {
	const { current } = useWizard();
	if (current !== id) return null;
	return /* @__PURE__ */ jsx(Fragment$1, { children });
};
Match.displayName = "Wizard.Match";
const Wizard = Object.assign(WizardRoot, { Match });

//#endregion
export { Wizard };
//# sourceMappingURL=Wizard.js.map