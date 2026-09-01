import { useEnvironment } from "../contexts/EnvironmentContext.js";
import { fromEntries } from "../utils/fromEntries.js";
import { ALTERNATIVE_PHONE_CODE_PROVIDERS } from "@clerk/shared/alternativePhoneCode";
import { iconImageUrl } from "@clerk/shared/constants";
import { OAUTH_PROVIDERS } from "@clerk/shared/oauth";
import { WEB3_PROVIDERS } from "@clerk/shared/web3";

//#region src/hooks/useEnabledThirdPartyProviders.tsx
const oauthStrategies = OAUTH_PROVIDERS.map((p) => p.strategy);
const web3Strategies = WEB3_PROVIDERS.map((p) => p.strategy);
const phoneCodeChannels = ALTERNATIVE_PHONE_CODE_PROVIDERS.map((p) => p.channel);
const providerToDisplayData = fromEntries([...[...OAUTH_PROVIDERS, ...WEB3_PROVIDERS].map((p) => {
	return [p.provider, {
		strategy: p.strategy,
		name: p.name,
		iconUrl: iconImageUrl(p.provider)
	}];
}), ...[...ALTERNATIVE_PHONE_CODE_PROVIDERS].map((p) => {
	return [p.channel, {
		strategy: p.channel,
		name: p.name,
		iconUrl: iconImageUrl(p.channel)
	}];
})]);
const strategyToDisplayData = fromEntries([...[...OAUTH_PROVIDERS, ...WEB3_PROVIDERS].map((p) => {
	return [p.strategy, {
		id: p.provider,
		name: p.name,
		iconUrl: iconImageUrl(p.provider)
	}];
}), ...[...ALTERNATIVE_PHONE_CODE_PROVIDERS].map((p) => {
	return [p.channel, {
		id: p.channel,
		name: p.name,
		iconUrl: iconImageUrl(p.channel)
	}];
})]);
const useEnabledThirdPartyProviders = () => {
	const { socialProviderStrategies, web3FirstFactors, authenticatableSocialStrategies, social, alternativePhoneCodeChannels } = useEnvironment().userSettings;
	const knownSocialProviderStrategies = socialProviderStrategies.filter((s) => oauthStrategies.includes(s));
	const customSocialProviderStrategies = socialProviderStrategies.filter((s) => !oauthStrategies.includes(s) && s.startsWith("oauth_custom_"));
	const knownAuthenticatableSocialStrategies = authenticatableSocialStrategies.filter((s) => oauthStrategies.includes(s));
	const customAuthenticatableSocialStrategies = authenticatableSocialStrategies.filter((s) => !oauthStrategies.includes(s) && s.startsWith("oauth_custom_"));
	const allCustomOAuthProviders = Object.keys(social).filter((s) => s.startsWith("oauth_custom_"));
	const activeCustomSocialStrategies = socialProviderStrategies.filter((s) => !oauthStrategies.includes(s) || s.startsWith("oauth_custom_"));
	allCustomOAuthProviders.forEach((s) => {
		const providerName = s.replace("oauth_", "");
		providerToDisplayData[providerName] = {
			strategy: s,
			name: social[s].name,
			iconUrl: social[s].logo_url || ""
		};
	});
	activeCustomSocialStrategies.forEach((s) => {
		strategyToDisplayData[s] = {
			id: s.replace("oauth_", ""),
			iconUrl: social[s].logo_url || "",
			name: social[s].name
		};
	});
	const authenticatableOauthStrategies = [...knownAuthenticatableSocialStrategies, ...customAuthenticatableSocialStrategies];
	authenticatableOauthStrategies.sort((a, b) => {
		const aName = a.replace(/^oauth_custom_|^oauth_/, "");
		const bName = b.replace(/^oauth_custom_|^oauth_/, "");
		return aName.localeCompare(bName);
	});
	const knownWeb3Strategies = web3FirstFactors.filter((s) => web3Strategies.includes(s));
	const knownAlternativePhoneCodeChannels = alternativePhoneCodeChannels.filter((s) => phoneCodeChannels.includes(s));
	return {
		strategies: [
			...knownSocialProviderStrategies,
			...knownWeb3Strategies,
			...customSocialProviderStrategies,
			...knownAlternativePhoneCodeChannels
		],
		web3Strategies: knownWeb3Strategies,
		alternativePhoneCodeChannels: knownAlternativePhoneCodeChannels,
		authenticatableOauthStrategies,
		strategyToDisplayData,
		providerToDisplayData
	};
};

//#endregion
export { useEnabledThirdPartyProviders };
//# sourceMappingURL=useEnabledThirdPartyProviders.js.map