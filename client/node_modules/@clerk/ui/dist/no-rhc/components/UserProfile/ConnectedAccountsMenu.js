import { useRouter } from "../../router/RouteContext.js";
import { useEnabledThirdPartyProviders } from "../../hooks/useEnabledThirdPartyProviders.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useUserProfileContext } from "../../contexts/components/UserProfile.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { sleep } from "../../utils/sleep.js";
import { ProviderIcon } from "../../common/ProviderIcon.js";
import { handleError } from "../../utils/errorHandler.js";
import { ProfileSection } from "../../elements/Section.js";
import { getExternalVerificationRedirectURL, reloadUserAfterOAuthCallback } from "./oauthTransport.js";
import { appendModalState } from "@clerk/shared/internal/clerk-js/queryStateParams";
import { useClerk, useReverification, useUser } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/ConnectedAccountsMenu.tsx
const ConnectMenuButton = (props) => {
	const { strategy } = props;
	const card = useCardState();
	const clerk = useClerk();
	const { user } = useUser();
	const { navigate } = useRouter();
	const { strategyToDisplayData } = useEnabledThirdPartyProviders();
	const { additionalOAuthScopes, componentName, mode } = useUserProfileContext();
	const isModal = mode === "modal";
	const createExternalAccount = useReverification((redirectUrl) => {
		const socialProvider = strategy.replace("oauth_", "");
		const decoratedRedirectUrl = isModal ? appendModalState({
			url: redirectUrl,
			componentName,
			socialProvider
		}) : redirectUrl;
		const additionalScopes = additionalOAuthScopes ? additionalOAuthScopes[socialProvider] : [];
		return user?.createExternalAccount({
			strategy,
			redirectUrl: decoratedRedirectUrl,
			additionalScopes
		});
	});
	const connect = async () => {
		if (!user) return;
		card.setLoading(strategy);
		const transport = clerk.__internal_oauthTransport;
		try {
			if (transport) {
				const url = getExternalVerificationRedirectURL(await createExternalAccount(String(await transport.getRedirectUrl())));
				const { callbackUrl } = await transport.open(url);
				await reloadUserAfterOAuthCallback(user, callbackUrl);
				sleep(2e3).then(() => card.setIdle(strategy));
				return;
			}
			const url = getExternalVerificationRedirectURL(await createExternalAccount(window.location.href));
			sleep(2e3).then(() => card.setIdle(strategy));
			navigate(url.href);
		} catch (err) {
			handleError(err, [], card.setError);
			card.setIdle(strategy);
		}
	};
	return /* @__PURE__ */ jsx(ProfileSection.ActionMenuItem, {
		id: strategyToDisplayData[strategy].id,
		onClick: connect,
		isDisabled: card.isLoading,
		variant: "ghost",
		isLoading: card.loadingMetadata === strategy,
		focusRing: false,
		closeAfterClick: false,
		localizationKey: localizationKeys("userProfile.connectedAccountPage.socialButtonsBlockButton", { provider: strategyToDisplayData[strategy].name }),
		sx: (t) => ({
			justifyContent: "start",
			gap: t.space.$2
		}),
		leftIcon: /* @__PURE__ */ jsx(ProviderIcon, {
			id: strategyToDisplayData[strategy].id,
			iconUrl: strategyToDisplayData[strategy].iconUrl,
			name: strategyToDisplayData[strategy].name,
			isLoading: card.loadingMetadata === strategy,
			isDisabled: card.isLoading,
			alt: `Connect ${strategyToDisplayData[strategy].name} account`,
			elementDescriptor: descriptors.providerIcon,
			elementId: descriptors.providerIcon.setId(strategyToDisplayData[strategy].id)
		})
	}, strategy);
};
const AddConnectedAccount = ({ onClick }) => {
	const { user } = useUser();
	const { strategies } = useEnabledThirdPartyProviders();
	const enabledStrategies = strategies.filter((s) => s.startsWith("oauth"));
	const connectedStrategies = user?.verifiedExternalAccounts.map((a) => `oauth_${a.provider}`);
	const unconnectedStrategies = enabledStrategies.filter((provider) => {
		return !connectedStrategies.includes(provider);
	});
	if (unconnectedStrategies.length === 0) return null;
	return /* @__PURE__ */ jsx(ProfileSection.ActionMenu, {
		triggerLocalizationKey: localizationKeys("userProfile.start.connectedAccountsSection.primaryButton"),
		id: "connectedAccounts",
		onClick,
		children: unconnectedStrategies.map((strategy) => /* @__PURE__ */ jsx(ConnectMenuButton, { strategy }, strategy))
	});
};

//#endregion
export { AddConnectedAccount };
//# sourceMappingURL=ConnectedAccountsMenu.js.map