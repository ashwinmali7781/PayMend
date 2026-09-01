import { Animated } from "../elements/Animated.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/common/Wizard.tsx
const useWizard = (params = {}) => {
	const { defaultStep = 0, onNextStep } = params;
	const [step, setStep] = React.useState(defaultStep);
	return {
		nextStep: React.useCallback(() => {
			onNextStep?.();
			setStep((s) => s + 1);
		}, []),
		prevStep: React.useCallback(() => setStep((s) => s - 1), []),
		goToStep: React.useCallback((i) => setStep(i), []),
		props: { step }
	};
};
const Wizard = (props) => {
	const { step, children, animate = true } = props;
	if (!animate) return React.Children.toArray(children)[step];
	return /* @__PURE__ */ jsx(Animated, { children: React.Children.toArray(children)[step] });
};

//#endregion
export { Wizard, useWizard };
//# sourceMappingURL=Wizard.js.map