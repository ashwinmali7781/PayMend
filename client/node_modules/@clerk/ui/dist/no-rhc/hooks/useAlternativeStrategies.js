import { useEnabledThirdPartyProviders } from "./useEnabledThirdPartyProviders.js";
import { allStrategiesButtonsComparator } from "../utils/factorSorting.js";
import { factorHasLocalStrategy, isResetPasswordStrategy } from "../components/SignIn/utils.js";
import { isWebAuthnSupported } from "@clerk/shared/webauthn";

//#region src/hooks/useAlternativeStrategies.ts
function useAlternativeStrategies({ filterOutFactor, supportedFirstFactors: _supportedFirstFactors }) {
	const { strategies: OAuthStrategies } = useEnabledThirdPartyProviders();
	const supportedFirstFactors = _supportedFirstFactors || [];
	const shouldAllowForAlternativeStrategies = supportedFirstFactors.filter((f) => f.strategy !== filterOutFactor?.strategy && !isResetPasswordStrategy(f.strategy)).length + OAuthStrategies.length > 0;
	const firstPartyFactors = supportedFirstFactors.filter((f) => !f.strategy.startsWith("oauth_") && !(f.strategy === filterOutFactor?.strategy)).filter((factor) => factorHasLocalStrategy(factor)).filter((factor) => factor.strategy === "passkey" ? isWebAuthnSupported() : true).sort(allStrategiesButtonsComparator);
	return {
		hasAnyStrategy: shouldAllowForAlternativeStrategies,
		hasFirstParty: !!firstPartyFactors,
		firstPartyFactors
	};
}

//#endregion
export { useAlternativeStrategies };
//# sourceMappingURL=useAlternativeStrategies.js.map