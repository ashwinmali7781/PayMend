import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useSignUpContext } from "../../contexts/components/SignUp.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Flex, Spinner } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { withRedirectToAfterSignUp, withRedirectToSignUpTask } from "../../common/withRedirect.js";
import { BackLink } from "../../elements/BackLink.js";
import { web3CallbackErrorHandler } from "../../utils/web3CallbackErrorHandler.js";
import { Suspense, lazy } from "react";
import { useClerk } from "@clerk/shared/react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignUp/SignUpStartSolanaWalletsCard.tsx
const Web3SolanaWalletButtons = lazy(() => import(
	/* webpackChunkName: "web3-solana-wallet-buttons" */
	"../../elements/Web3SolanaWalletButtons.js"
).then((m) => ({ default: m.Web3SolanaWalletButtons })));
const SignUpStartSolanaWalletsCardInner = () => {
	const clerk = useClerk();
	const card = useCardState();
	const router = useRouter();
	const ctx = useSignUpContext();
	const onBackLinkClick = () => {
		router.navigate("../");
	};
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "chooseWallet",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signUp.web3Solana.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("signUp.web3Solana.subtitle") })]
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsxs(Flex, {
				direction: "col",
				gap: 4,
				children: [/* @__PURE__ */ jsx(Suspense, {
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
					children: /* @__PURE__ */ jsx(Web3SolanaWalletButtons, { web3AuthCallback: ({ walletName }) => {
						return clerk.authenticateWithWeb3({
							customNavigate: router.navigate,
							redirectUrl: ctx.afterSignUpUrl || "/",
							signUpContinueUrl: "continue",
							strategy: "web3_solana_signature",
							unsafeMetadata: ctx.unsafeMetadata,
							walletName
						}).catch((err) => web3CallbackErrorHandler(err, card.setError));
					} })
				}), /* @__PURE__ */ jsx(BackLink, {
					boxElementDescriptor: descriptors.backRow,
					linkElementDescriptor: descriptors.backLink,
					onClick: onBackLinkClick
				})]
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, {})] })
	});
};
const SignUpStartSolanaWalletsCard = withRedirectToSignUpTask(withRedirectToAfterSignUp(withCardStateProvider(SignUpStartSolanaWalletsCardInner)));

//#endregion
export { SignUpStartSolanaWalletsCard };
//# sourceMappingURL=SignUpStartSolanaWalletsCard.js.map