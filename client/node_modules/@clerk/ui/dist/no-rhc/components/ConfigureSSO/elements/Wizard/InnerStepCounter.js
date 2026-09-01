import { Step } from "../Step.js";
import { useWizard } from "./WizardContext.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/ConfigureSSO/elements/Wizard/InnerStepCounter.tsx
const InnerStepCounter = () => {
	const { currentIndex, totalSteps } = useWizard();
	return /* @__PURE__ */ jsx(Step.Counter, {
		total: totalSteps,
		current: currentIndex + 1
	});
};

//#endregion
export { InnerStepCounter };
//# sourceMappingURL=InnerStepCounter.js.map