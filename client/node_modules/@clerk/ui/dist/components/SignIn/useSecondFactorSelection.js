import { determineStartingSignInSecondFactor } from "./utils.js";
import React from "react";

//#region src/components/SignIn/useSecondFactorSelection.ts
const secondFactorKey = (factor) => {
	if (!factor) return "";
	let key = factor.strategy;
	if ("phoneNumberId" in factor) key += factor.phoneNumberId;
	return key;
};
function useSecondFactorSelection(availableFactors) {
	const lastPreparedFactorKeyRef = React.useRef("");
	const [currentFactor, setCurrentFactor] = React.useState(() => determineStartingSignInSecondFactor(availableFactors));
	const [showAllStrategies, setShowAllStrategies] = React.useState(!currentFactor);
	const toggleAllStrategies = () => setShowAllStrategies((s) => !s);
	const handleFactorPrepare = () => {
		lastPreparedFactorKeyRef.current = secondFactorKey(currentFactor);
	};
	const selectFactor = (factor) => {
		setCurrentFactor(factor);
		setShowAllStrategies(false);
	};
	return {
		currentFactor,
		factorAlreadyPrepared: lastPreparedFactorKeyRef.current === secondFactorKey(currentFactor),
		handleFactorPrepare,
		selectFactor,
		showAllStrategies,
		toggleAllStrategies
	};
}

//#endregion
export { useSecondFactorSelection };
//# sourceMappingURL=useSecondFactorSelection.js.map