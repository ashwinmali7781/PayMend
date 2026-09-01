import { localizationKeys } from "../localization/localizationKeys.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Alert, Button, Col, Text } from "../customizables/index.js";
import { useCardState } from "./contexts/index.js";
import { Card } from "./Card/index.js";
import { Header } from "./Header.js";
import { useFieldOTP } from "./CodeControl.js";
import { Form } from "./Form.js";
import { IdentityPreview } from "./IdentityPreview.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/VerificationCodeCard.tsx
const VerificationCodeCard = (props) => {
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsx(Card.Content, { children: /* @__PURE__ */ jsx(VerificationCodeContent, { ...props }) }), /* @__PURE__ */ jsx(Card.Footer, {})] });
};
const VerificationCodeContent = (props) => {
	const { showAlternativeMethods = true, cardNotice, children } = props;
	const card = useCardState();
	const otp = useFieldOTP({
		onCodeEntryFinished: (code, resolve, reject) => {
			props.onCodeEntryFinishedAction(code, resolve, reject);
		},
		onResendCodeClicked: props.onResendCodeClicked
	});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsxs(Header.Root, {
			badgeText: props.badgeText,
			children: [
				/* @__PURE__ */ jsx(Header.Title, { localizationKey: props.cardTitle }),
				/* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: props.cardSubtitle }),
				/* @__PURE__ */ jsx(IdentityPreview, {
					identifier: props.safeIdentifier,
					avatarUrl: props.profileImageUrl,
					onClick: props.onIdentityPreviewEditClicked ? props.onIdentityPreviewEditClicked : void 0,
					editButtonAriaLabel: props.identityPreviewEditButtonAriaLabel
				})
			]
		}),
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		children,
		/* @__PURE__ */ jsxs(Col, {
			elementDescriptor: descriptors.main,
			gap: 8,
			children: [
				/* @__PURE__ */ jsx(Form.OTPInput, {
					...otp,
					label: props.inputLabel,
					resendButton: props.resendButton
				}),
				cardNotice && /* @__PURE__ */ jsx(Alert, {
					colorScheme: "warning",
					children: /* @__PURE__ */ jsx(Text, {
						colorScheme: "warning",
						localizationKey: cardNotice,
						variant: "caption"
					})
				}),
				/* @__PURE__ */ jsxs(Col, {
					gap: 3,
					children: [
						/* @__PURE__ */ jsx(Button, {
							elementDescriptor: descriptors.formButtonPrimary,
							block: true,
							hasArrow: true,
							isLoading: otp.isLoading,
							localizationKey: localizationKeys("formButtonPrimary"),
							onClick: otp.onFakeContinue
						}),
						props.onBackLinkClicked && /* @__PURE__ */ jsx(Button, {
							elementDescriptor: descriptors.formButtonReset,
							block: true,
							variant: "ghost",
							localizationKey: props.backLinkLabel,
							onClick: props.onBackLinkClicked
						}),
						showAlternativeMethods && props.onShowAlternativeMethodsClicked && /* @__PURE__ */ jsx(Card.Action, {
							elementId: "alternativeMethods",
							children: /* @__PURE__ */ jsx(Card.ActionLink, {
								localizationKey: props.alternativeMethodsLabel ?? localizationKeys("footerActionLink__useAnotherMethod"),
								onClick: props.onShowAlternativeMethodsClicked
							})
						}),
						props.onDifferentAccountClicked && /* @__PURE__ */ jsx(Card.Action, {
							elementId: "signIn",
							children: /* @__PURE__ */ jsx(Card.ActionLink, {
								localizationKey: localizationKeys("backButton"),
								onClick: props.onDifferentAccountClicked
							})
						})
					]
				})
			]
		})
	] });
};

//#endregion
export { VerificationCodeCard, VerificationCodeContent };
//# sourceMappingURL=VerificationCodeCard.js.map