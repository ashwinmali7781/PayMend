import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgAdd from "../../icons/add.js";
import SvgArrowRight from "../../icons/arrow-right.js";
import { useSignInContext } from "../../contexts/components/SignIn.js";
import { useSignOutContext } from "../../contexts/components/SignOut.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Col } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { withRedirectToAfterSignIn } from "../../common/withRedirect.js";
import { Action, Actions } from "../../elements/Actions.js";
import { PreviewButton } from "../../elements/PreviewButton.js";
import { UserPreview } from "../../elements/UserPreview.js";
import { SignOutAllActions } from "../UserButton/SessionActions.js";
import { useMultisessionActions } from "../UserButton/useMultisessionActions.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInAccountSwitcher.tsx
const SignInAccountSwitcherInternal = () => {
	const card = useCardState();
	const { userProfileUrl } = useEnvironment().displayConfig;
	const { afterSignInUrl, path: signInPath, signInUrl, taskUrl } = useSignInContext();
	const { navigateAfterSignOut } = useSignOutContext();
	const { handleSignOutAllClicked, handleSessionClicked, signedInSessions, handleAddAccountClicked } = useMultisessionActions({
		taskUrl,
		navigateAfterSignOut,
		afterSwitchSessionUrl: afterSignInUrl,
		userProfileUrl,
		signInUrl: signInPath ?? signInUrl,
		user: void 0
	});
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "accountSwitcher",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, {
			sx: (t) => ({ padding: `${t.space.$8} ${t.space.$none} ${t.space.$none}` }),
			children: [
				/* @__PURE__ */ jsxs(Header.Root, { children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signIn.accountSwitcher.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("signIn.accountSwitcher.subtitle") })] }),
				/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
				/* @__PURE__ */ jsx(Col, {
					elementDescriptor: descriptors.main,
					gap: 8,
					sx: (t) => ({
						borderTopWidth: t.borderWidths.$normal,
						borderTopStyle: t.borderStyles.$solid,
						borderTopColor: t.colors.$borderAlpha100
					}),
					children: /* @__PURE__ */ jsxs(Actions, { children: [signedInSessions.map((s) => /* @__PURE__ */ jsx(PreviewButton, {
						onClick: handleSessionClicked(s),
						sx: (theme) => ({
							height: theme.sizes.$16,
							justifyContent: "flex-start",
							borderRadius: 0
						}),
						icon: SvgArrowRight,
						children: /* @__PURE__ */ jsx(UserPreview, {
							user: s.user,
							sx: { width: "100%" }
						})
					}, s.id)), /* @__PURE__ */ jsx(Action, {
						elementDescriptor: descriptors.accountSwitcherActionButton,
						elementId: descriptors.accountSwitcherActionButton.setId("addAccount"),
						iconBoxElementDescriptor: descriptors.accountSwitcherActionButtonIconBox,
						iconBoxElementId: descriptors.accountSwitcherActionButtonIconBox.setId("addAccount"),
						iconElementDescriptor: descriptors.accountSwitcherActionButtonIcon,
						iconElementId: descriptors.accountSwitcherActionButtonIcon.setId("addAccount"),
						icon: SvgAdd,
						label: localizationKeys("signIn.accountSwitcher.action__addAccount"),
						onClick: handleAddAccountClicked,
						iconSx: (t) => ({
							width: t.sizes.$9,
							height: t.sizes.$6
						}),
						iconBoxSx: (t) => ({
							minHeight: t.sizes.$9,
							minWidth: t.sizes.$6,
							alignItems: "center"
						}),
						spinnerSize: "md"
					})] })
				})
			]
		}), /* @__PURE__ */ jsx(Card.Footer, {
			sx: (t) => ({ ">:first-of-type": {
				padding: `${t.space.$1}`,
				width: "100%"
			} }),
			children: /* @__PURE__ */ jsx(Card.Action, {
				sx: {
					width: "100%",
					">:first-of-type": {
						width: "100%",
						borderBottomWidth: 0
					}
				},
				children: /* @__PURE__ */ jsx(SignOutAllActions, {
					handleSignOutAllClicked,
					elementDescriptor: descriptors.accountSwitcherActionButton,
					elementId: descriptors.accountSwitcherActionButton.setId("signOutAll"),
					iconBoxElementDescriptor: descriptors.accountSwitcherActionButtonIconBox,
					iconBoxElementId: descriptors.accountSwitcherActionButtonIconBox.setId("signOutAll"),
					iconElementDescriptor: descriptors.accountSwitcherActionButtonIcon,
					iconElementId: descriptors.accountSwitcherActionButtonIcon.setId("signOutAll"),
					label: localizationKeys("signIn.accountSwitcher.action__signOutAll"),
					actionSx: (t) => ({ padding: `${t.space.$2} ${t.space.$2}` })
				})
			})
		})] })
	});
};
const SignInAccountSwitcher = withRedirectToAfterSignIn(withCardStateProvider(SignInAccountSwitcherInternal));

//#endregion
export { SignInAccountSwitcher };
//# sourceMappingURL=SignInAccountSwitcher.js.map