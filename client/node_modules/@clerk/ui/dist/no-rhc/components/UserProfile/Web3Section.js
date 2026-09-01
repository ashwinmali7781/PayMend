import { useEnabledThirdPartyProviders } from "../../hooks/useEnabledThirdPartyProviders.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Badge, Box, Flex, Text } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { ProviderIcon } from "../../common/ProviderIcon.js";
import { handleError } from "../../utils/errorHandler.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { Action } from "../../elements/Action/index.js";
import { ThreeDotsMenu } from "../../elements/ThreeDotsMenu.js";
import { ProfileSection } from "../../elements/Section.js";
import { sortIdentificationBasedOnVerification } from "./utils.js";
import { RemoveWeb3WalletForm } from "./RemoveResourceForm.js";
import { AddWeb3WalletActionMenu } from "./Web3Form.js";
import { Fragment, useState } from "react";
import { useReverification, useUser } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/Web3Section.tsx
const RemoveWeb3WalletScreen = (props) => {
	const { close } = useActionContext();
	return /* @__PURE__ */ jsx(RemoveWeb3WalletForm, {
		onSuccess: close,
		onReset: close,
		...props
	});
};
const shortenWeb3Address = (address) => {
	if (address.length <= 10) return address;
	return address.slice(0, 6) + "..." + address.slice(-4);
};
const Web3Section = withCardStateProvider(({ shouldAllowCreation = true }) => {
	const { user } = useUser();
	const card = useCardState();
	const { strategyToDisplayData } = useEnabledThirdPartyProviders();
	const hasWeb3Wallets = Boolean(user?.web3Wallets?.length);
	const [actionValue, setActionValue] = useState(null);
	if (!shouldAllowCreation && !hasWeb3Wallets) return null;
	return /* @__PURE__ */ jsxs(ProfileSection.Root, {
		title: localizationKeys("userProfile.start.web3WalletsSection.title"),
		centered: false,
		id: "web3Wallets",
		children: [/* @__PURE__ */ jsx(Card.Alert, { children: card.error }), /* @__PURE__ */ jsxs(Action.Root, {
			value: actionValue,
			onChange: setActionValue,
			children: [/* @__PURE__ */ jsx(ProfileSection.ItemList, {
				id: "web3Wallets",
				children: sortIdentificationBasedOnVerification(user?.web3Wallets, user?.primaryWeb3WalletId).map((wallet) => {
					const strategy = wallet.verification.strategy;
					const walletId = wallet.id;
					const displayData = strategyToDisplayData[strategy] ?? null;
					if (!displayData && strategy !== "admin") return null;
					return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(ProfileSection.Item, {
						id: "web3Wallets",
						align: "start",
						children: [/* @__PURE__ */ jsxs(Flex, {
							sx: (t) => ({
								alignItems: "center",
								gap: t.space.$2,
								width: "100%"
							}),
							children: [displayData?.iconUrl && /* @__PURE__ */ jsx(ProviderIcon, {
								id: displayData.id,
								iconUrl: displayData.iconUrl,
								name: displayData.name,
								alt: displayData.name
							}), /* @__PURE__ */ jsx(Box, {
								sx: {
									whiteSpace: "nowrap",
									overflow: "hidden"
								},
								children: /* @__PURE__ */ jsxs(Flex, {
									gap: 2,
									justify: "start",
									children: [
										/* @__PURE__ */ jsx(Text, { children: displayData ? `${displayData.name} (${shortenWeb3Address(wallet.web3Wallet)})` : shortenWeb3Address(wallet.web3Wallet) }),
										user?.primaryWeb3WalletId === walletId && /* @__PURE__ */ jsx(Badge, { localizationKey: localizationKeys("badge__primary") }),
										wallet.verification.status !== "verified" && /* @__PURE__ */ jsx(Badge, { localizationKey: localizationKeys("badge__unverified") })
									]
								})
							})]
						}), /* @__PURE__ */ jsx(Web3WalletMenu, {
							walletId,
							isVerified: wallet.verification.status === "verified"
						})]
					}, walletId), /* @__PURE__ */ jsx(Action.Open, {
						value: `remove-${walletId}`,
						children: /* @__PURE__ */ jsx(Action.Card, {
							variant: "destructive",
							children: /* @__PURE__ */ jsx(RemoveWeb3WalletScreen, { walletId: wallet.id })
						})
					})] }, wallet.id);
				})
			}), shouldAllowCreation && /* @__PURE__ */ jsx(AddWeb3WalletActionMenu, {})]
		})]
	});
});
const Web3WalletMenu = ({ walletId, isVerified }) => {
	const card = useCardState();
	const { open } = useActionContext();
	const { user } = useUser();
	const isPrimary = user?.primaryWeb3WalletId === walletId;
	const setPrimary = useReverification(() => {
		return user?.update({ primaryWeb3WalletId: walletId });
	});
	return /* @__PURE__ */ jsx(ThreeDotsMenu, { actions: [!isPrimary && isVerified ? {
		label: localizationKeys("userProfile.start.web3WalletsSection.detailsAction__nonPrimary"),
		onClick: () => {
			setPrimary().catch((e) => handleError(e, [], card.setError));
		}
	} : null, {
		label: localizationKeys("userProfile.start.web3WalletsSection.destructiveAction"),
		isDestructive: true,
		onClick: () => open(`remove-${walletId}`)
	}].filter((a) => a !== null) });
};

//#endregion
export { Web3Section };
//# sourceMappingURL=Web3Section.js.map