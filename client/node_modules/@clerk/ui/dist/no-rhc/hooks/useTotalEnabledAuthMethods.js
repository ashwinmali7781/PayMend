import { useEnvironment } from "../contexts/EnvironmentContext.js";
import { useEnabledThirdPartyProviders } from "./useEnabledThirdPartyProviders.js";

//#region src/hooks/useTotalEnabledAuthMethods.ts
const useTotalEnabledAuthMethods = () => {
	const { userSettings } = useEnvironment();
	const { authenticatableOauthStrategies, web3Strategies, alternativePhoneCodeChannels } = useEnabledThirdPartyProviders();
	const firstFactorCount = userSettings.enabledFirstFactorIdentifiers.filter((attr) => attr !== "passkey").length;
	const oauthCount = authenticatableOauthStrategies.length;
	const web3Count = web3Strategies.length;
	const alternativePhoneCodeCount = alternativePhoneCodeChannels.length;
	return firstFactorCount + oauthCount + web3Count + alternativePhoneCodeCount;
};

//#endregion
export { useTotalEnabledAuthMethods };
//# sourceMappingURL=useTotalEnabledAuthMethods.js.map