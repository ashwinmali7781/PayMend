import { useRouter } from "../../router/RouteContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Flex } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { Form } from "../../elements/Form.js";
import { IdentityPreview } from "../../elements/IdentityPreview.js";
import { HavingTrouble } from "./HavingTrouble.js";
import { useHandleAuthenticateWithPasskey } from "./shared.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorOnePasskey.tsx
const SignInFactorOnePasskey = (props) => {
	const { onShowAlternativeMethodsClick } = props;
	const card = useCardState();
	const signIn = useCoreSignIn();
	const { navigate } = useRouter();
	const [showHavingTrouble, setShowHavingTrouble] = React.useState(false);
	const toggleHavingTrouble = React.useCallback(() => setShowHavingTrouble((s) => !s), [setShowHavingTrouble]);
	const onSecondFactor = () => navigate("../factor-two");
	const authenticateWithPasskey = useHandleAuthenticateWithPasskey(onSecondFactor);
	const goBack = () => {
		return navigate("../");
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		return authenticateWithPasskey();
	};
	if (showHavingTrouble) return /* @__PURE__ */ jsx(HavingTrouble, { onBackLinkClick: toggleHavingTrouble });
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "password",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [
					/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signIn.passkey.title") }),
					/* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("signIn.passkey.subtitle") }),
					/* @__PURE__ */ jsx(IdentityPreview, {
						identifier: signIn.identifier,
						avatarUrl: signIn.userData.imageUrl,
						onClick: goBack,
						editButtonAriaLabel: localizationKeys("identityPreviewEditButton__identifier")
					})
				]
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsxs(Flex, {
				direction: "col",
				elementDescriptor: descriptors.main,
				gap: 4,
				children: [/* @__PURE__ */ jsx(Form.Root, {
					onSubmit: handleSubmit,
					gap: 8,
					children: /* @__PURE__ */ jsx(Form.SubmitButton, { hasArrow: true })
				}), /* @__PURE__ */ jsx(Card.Action, {
					elementId: onShowAlternativeMethodsClick ? "alternativeMethods" : "havingTrouble",
					children: /* @__PURE__ */ jsx(Card.ActionLink, {
						localizationKey: localizationKeys(onShowAlternativeMethodsClick ? "footerActionLink__useAnotherMethod" : "signIn.alternativeMethods.actionLink"),
						onClick: onShowAlternativeMethodsClick || toggleHavingTrouble
					})
				})]
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, {})] })
	});
};

//#endregion
export { SignInFactorOnePasskey };
//# sourceMappingURL=SignInFactorOnePasskey.js.map