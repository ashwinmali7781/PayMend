import { localizationKeys } from "../../localization/localizationKeys.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Button, Flex, Spinner } from "../../customizables/index.js";
import { handleError } from "../../utils/errorHandler.js";
import { Form } from "../../elements/Form.js";
import { FormButtonContainer } from "../../elements/FormButtons.js";
import { FormContainer } from "../../elements/FormContainer.js";
import { useActionContext } from "../../elements/Action/ActionRoot.js";
import { ClerkRuntimeError } from "@clerk/shared/error";
import { Suspense, lazy } from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserProfile/Web3SelectSolanaWalletScreen.tsx
const Web3SolanaWalletButtons = lazy(() => import(
	/* webpackChunkName: "web3-solana-wallet-buttons" */
	"../../elements/Web3SolanaWalletButtons.js"
).then((m) => ({ default: m.Web3SolanaWalletButtons })));
const Web3SelectSolanaWalletScreen = ({ onConnect }) => {
	const card = useCardState();
	const { close } = useActionContext();
	const onClick = async ({ walletName }) => {
		card.setLoading(walletName);
		try {
			await onConnect({
				strategy: "web3_solana_signature",
				walletName
			});
			card.setIdle();
			close();
		} catch (err) {
			card.setIdle();
			if (err instanceof Error) handleError(err, [], card.setError);
			else handleError(new ClerkRuntimeError("An error occurred while generating the Solana signature.", {
				code: "web3_solana_signature_generation_failed",
				cause: err instanceof Error ? err : void 0
			}), [], card.setError);
		}
	};
	return /* @__PURE__ */ jsx(FormContainer, {
		headerTitle: localizationKeys("userProfile.start.web3WalletsSection.web3SelectSolanaWalletScreen.title"),
		headerSubtitle: localizationKeys("userProfile.start.web3WalletsSection.web3SelectSolanaWalletScreen.subtitle"),
		children: /* @__PURE__ */ jsxs(Form.Root, { children: [/* @__PURE__ */ jsx(Suspense, {
			fallback: /* @__PURE__ */ jsx(Flex, {
				direction: "row",
				align: "center",
				justify: "center",
				sx: (t) => ({
					height: "100%",
					minHeight: t.sizes.$32
				}),
				children: /* @__PURE__ */ jsx(Spinner, {
					size: "lg",
					colorScheme: "primary",
					elementDescriptor: descriptors.spinner
				})
			}),
			children: /* @__PURE__ */ jsx(Web3SolanaWalletButtons, { web3AuthCallback: onClick })
		}), /* @__PURE__ */ jsx(FormButtonContainer, { children: /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			onClick: () => {
				close();
			},
			localizationKey: localizationKeys("userProfile.formButtonReset"),
			elementDescriptor: descriptors.formButtonReset
		}) })] })
	});
};

//#endregion
export { Web3SelectSolanaWalletScreen };
//# sourceMappingURL=Web3SelectSolanaWalletScreen.js.map