import { localizationKeys } from "../../localization/localizationKeys.js";
import { useCoreSignIn } from "../../contexts/CoreClientContext.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { useCardState } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Col } from "../../customizables/index.js";
import { Card } from "../../elements/Card/index.js";
import { Header } from "../../elements/Header.js";
import { ArrowBlockButton } from "../../elements/ArrowBlockButton.js";
import { formatSafeIdentifier } from "../../utils/formatSafeIdentifier.js";
import { backupCodePrefFactorComparator } from "../../utils/factorSorting.js";
import { HavingTrouble } from "./HavingTrouble.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/SignIn/SignInFactorTwoAlternativeMethods.tsx
const SignInFactorTwoAlternativeMethods = (props) => {
	const [showHavingTrouble, setShowHavingTrouble] = React.useState(false);
	const toggleHavingTrouble = React.useCallback(() => setShowHavingTrouble((s) => !s), [setShowHavingTrouble]);
	if (showHavingTrouble) return /* @__PURE__ */ jsx(HavingTrouble, { onBackLinkClick: toggleHavingTrouble });
	return /* @__PURE__ */ jsx(AlternativeMethodsList, {
		onBackLinkClick: props.onBackLinkClick,
		onFactorSelected: props.onFactorSelected,
		onHavingTroubleClick: toggleHavingTrouble
	});
};
const AlternativeMethodsList = (props) => {
	const { onHavingTroubleClick, onFactorSelected, onBackLinkClick } = props;
	const card = useCardState();
	const { supportedSecondFactors } = useCoreSignIn();
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "alternativeMethods",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: localizationKeys("signIn.alternativeMethods.title") }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: localizationKeys("signIn.alternativeMethods.subtitle") })]
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsxs(Col, {
				elementDescriptor: descriptors.main,
				gap: 3,
				children: [/* @__PURE__ */ jsx(Col, {
					gap: 2,
					children: supportedSecondFactors && supportedSecondFactors.sort(backupCodePrefFactorComparator).map((factor, i) => /* @__PURE__ */ jsx(ArrowBlockButton, {
						textLocalizationKey: getButtonLabel(factor),
						elementDescriptor: descriptors.alternativeMethodsBlockButton,
						textElementDescriptor: descriptors.alternativeMethodsBlockButtonText,
						arrowElementDescriptor: descriptors.alternativeMethodsBlockButtonArrow,
						isDisabled: card.isLoading,
						onClick: () => onFactorSelected(factor)
					}, i))
				}), /* @__PURE__ */ jsx(Card.Action, {
					elementId: "alternativeMethods",
					children: onBackLinkClick && /* @__PURE__ */ jsx(Card.ActionLink, {
						localizationKey: localizationKeys("backButton"),
						onClick: props.onBackLinkClick
					})
				})]
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, { children: /* @__PURE__ */ jsxs(Card.Action, {
			elementId: "havingTrouble",
			children: [/* @__PURE__ */ jsx(Card.ActionText, { localizationKey: localizationKeys("signIn.alternativeMethods.actionText") }), /* @__PURE__ */ jsx(Card.ActionLink, {
				localizationKey: localizationKeys("signIn.alternativeMethods.actionLink"),
				onClick: onHavingTroubleClick
			})]
		}) })] })
	});
};
function getButtonLabel(factor) {
	switch (factor.strategy) {
		case "phone_code": return localizationKeys("signIn.alternativeMethods.blockButton__phoneCode", { identifier: formatSafeIdentifier(factor.safeIdentifier) || "" });
		case "totp": return localizationKeys("signIn.alternativeMethods.blockButton__totp");
		case "backup_code": return localizationKeys("signIn.alternativeMethods.blockButton__backupCode");
		case "email_code": return localizationKeys("signIn.alternativeMethods.blockButton__emailCode", { identifier: formatSafeIdentifier(factor.safeIdentifier) || "" });
		case "email_link": return localizationKeys("signIn.alternativeMethods.blockButton__emailLink", { identifier: formatSafeIdentifier(factor.safeIdentifier) || "" });
		default:
			((_) => _)(factor);
			throw new Error("Invalid sign in strategy");
	}
}

//#endregion
export { SignInFactorTwoAlternativeMethods };
//# sourceMappingURL=SignInFactorTwoAlternativeMethods.js.map