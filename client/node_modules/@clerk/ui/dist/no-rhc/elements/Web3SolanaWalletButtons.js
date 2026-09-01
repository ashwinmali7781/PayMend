import { localizationKeys } from "../localization/localizationKeys.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { mqu } from "../styledSystem/breakpoints.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState } from "./contexts/index.js";
import { Button, Flex, Grid, Icon, Image, SimpleButton, Spinner, Text } from "../customizables/index.js";
import { Card } from "./Card/index.js";
import { sleep } from "../utils/sleep.js";
import { distributeStrategiesIntoRows } from "./utils.js";
import { LinkRenderer } from "./LinkRenderer.js";
import { WalletInitialIcon } from "../common/WalletInitialIcon.js";
import React, { forwardRef, isValidElement, useMemo } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { MAINNET_ENDPOINT } from "@solana/wallet-standard";

//#region src/elements/Web3SolanaWalletButtons.tsx
const SOCIAL_BUTTON_BLOCK_THRESHOLD = 2;
const SOCIAL_BUTTON_PRE_TEXT_THRESHOLD = 1;
const MAX_STRATEGIES_PER_ROW = 5;
const Web3SolanaWalletButtonsInner = ({ web3AuthCallback }) => {
	const card = useCardState();
	const { wallets } = useWallet();
	const { t } = useLocalizations();
	const installedWallets = React.useMemo(() => wallets.filter((w) => {
		return w.readyState === WalletReadyState.Installed;
	}).map((wallet) => {
		return {
			name: wallet.adapter.name,
			icon: wallet.adapter.icon
		};
	}), [wallets]);
	const startWeb3AuthFlow = (walletName) => async () => {
		card.setLoading(walletName);
		try {
			await web3AuthCallback({ walletName });
		} catch {
			await sleep(1e3);
		} finally {
			card.setIdle();
		}
	};
	const { strategyRows } = distributeStrategiesIntoRows(installedWallets, MAX_STRATEGIES_PER_ROW, void 0);
	const strategyRowOneLength = strategyRows.at(0)?.length ?? 0;
	const shouldForceSingleColumnOnMobile = installedWallets.length === 2;
	const ButtonElement = installedWallets.length <= SOCIAL_BUTTON_BLOCK_THRESHOLD ? WalletButtonBlock : WalletButtonIcon;
	if (installedWallets.length === 0) return /* @__PURE__ */ jsx(Card.Alert, { children: /* @__PURE__ */ jsx(LinkRenderer, {
		text: t(localizationKeys("web3SolanaWalletButtons.noneAvailable", { solanaWalletsLink: "https://solana.com/solana-wallets" })),
		isExternal: true,
		sx: (t) => ({
			textDecoration: "underline",
			textUnderlineOffset: t.space.$1,
			color: "inherit"
		})
	}) });
	return /* @__PURE__ */ jsx(Flex, {
		direction: "col",
		gap: 2,
		elementDescriptor: descriptors.web3SolanaWalletButtonsRoot,
		children: strategyRows.map((row, rowIndex) => /* @__PURE__ */ jsx(Grid, {
			elementDescriptor: descriptors.web3SolanaWalletButtons,
			gap: 2,
			sx: (t) => ({
				justifyContent: "center",
				[mqu.sm]: { gridTemplateColumns: shouldForceSingleColumnOnMobile ? "repeat(1, minmax(0, 1fr))" : void 0 },
				gridTemplateColumns: wallets.length < 1 ? `repeat(1, minmax(0, 1fr))` : `repeat(${row.length}, ${rowIndex === 0 ? `minmax(0, 1fr)` : `minmax(0, calc((100% - (${strategyRowOneLength} - 1) * ${t.sizes.$2}) / ${strategyRowOneLength}))`})`
			}),
			children: row.map((w) => {
				const label = installedWallets.length === SOCIAL_BUTTON_PRE_TEXT_THRESHOLD ? localizationKeys("web3SolanaWalletButtons.continue", { walletName: w.name }) : w.name;
				const imageOrInitial = w.icon ? /* @__PURE__ */ jsx(Image, {
					elementDescriptor: [descriptors.walletIcon, descriptors.web3SolanaWalletButtonsWalletInitialIcon],
					isDisabled: card.isLoading,
					isLoading: card.loadingMetadata === w.name,
					src: w.icon,
					alt: t(localizationKeys("web3SolanaWalletButtons.connect", { walletName: w.name })),
					sx: (theme) => ({
						width: theme.sizes.$4,
						height: "auto",
						maxWidth: "100%"
					})
				}) : /* @__PURE__ */ jsx(WalletInitialIcon, {
					value: w.name,
					isDisabled: card.isLoading,
					id: w.name
				});
				return /* @__PURE__ */ jsx(ButtonElement, {
					id: w.name,
					onClick: startWeb3AuthFlow(w.name),
					isLoading: card.loadingMetadata === w.name,
					isDisabled: card.isLoading,
					label: t(label),
					icon: imageOrInitial
				}, w.name);
			})
		}, row.map((r) => {
			return r.name;
		}).join("-")))
	});
};
const WalletButtonIcon = forwardRef((props, ref) => {
	const { icon, label, id, ...rest } = props;
	return /* @__PURE__ */ jsx(Button, {
		ref,
		"aria-label": label,
		textVariant: "buttonLarge",
		variant: "outline",
		colorScheme: "neutral",
		hoverAsFocus: true,
		sx: (t) => ({
			minHeight: t.sizes.$8,
			width: "100%"
		}),
		...rest,
		children: icon
	});
});
const WalletButtonBlock = forwardRef((props, ref) => {
	const { id, icon, isLoading, label, ...rest } = props;
	const isIconElement = isValidElement(icon);
	return /* @__PURE__ */ jsx(SimpleButton, {
		variant: "outline",
		block: true,
		isLoading,
		hoverAsFocus: true,
		ref,
		...rest,
		sx: (theme) => [{
			gap: theme.space.$4,
			position: "relative",
			justifyContent: "flex-start"
		}, props.sx],
		children: /* @__PURE__ */ jsxs(Flex, {
			justify: "center",
			align: "center",
			as: "span",
			gap: 3,
			sx: {
				width: "100%",
				overflow: "hidden"
			},
			children: [(isLoading || icon) && /* @__PURE__ */ jsx(Flex, {
				as: "span",
				center: true,
				sx: (theme) => ({ flex: `0 0 ${theme.space.$4}` }),
				children: isLoading ? /* @__PURE__ */ jsx(Spinner, {
					size: "sm",
					elementDescriptor: descriptors.spinner
				}) : !isIconElement && icon ? /* @__PURE__ */ jsx(Icon, {
					icon,
					sx: [(theme) => ({
						color: theme.colors.$neutralAlpha600,
						width: theme.sizes.$4,
						position: "absolute"
					})]
				}) : icon
			}), /* @__PURE__ */ jsx(Text, {
				as: "span",
				truncate: true,
				variant: "buttonLarge",
				children: label
			})]
		})
	});
});
const Web3SolanaWalletButtons = (props) => {
	const network = MAINNET_ENDPOINT;
	return /* @__PURE__ */ jsx(ConnectionProvider, {
		endpoint: network,
		children: /* @__PURE__ */ jsx(WalletProvider, {
			wallets: useMemo(() => [], [network]),
			onError: (err) => {
				console.error(err);
			},
			children: /* @__PURE__ */ jsx(Web3SolanaWalletButtonsInner, { web3AuthCallback: props.web3AuthCallback })
		})
	});
};

//#endregion
export { Web3SolanaWalletButtons };
//# sourceMappingURL=Web3SolanaWalletButtons.js.map