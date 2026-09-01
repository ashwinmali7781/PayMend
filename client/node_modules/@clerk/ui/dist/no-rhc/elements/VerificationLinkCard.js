import { useRouter } from "../router/RouteContext.js";
import { localizationKeys } from "../localization/localizationKeys.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState } from "./contexts/index.js";
import { Flow } from "../customizables/Flow.js";
import { Alert, Col, Text } from "../customizables/index.js";
import { Card } from "./Card/index.js";
import { Header } from "./Header.js";
import { TimerButton } from "./TimerButton.js";
import { IdentityPreview } from "./IdentityPreview.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/VerificationLinkCard.tsx
const VerificationLinkCard = (props) => {
	const { navigate } = useRouter();
	const card = useCardState();
	const goBack = () => {
		return navigate("../");
	};
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "emailLinkVerify",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: props.cardTitle }), /* @__PURE__ */ jsxs(VerificationLink, {
					formSubtitle: props.formSubtitle,
					resendButton: props.resendButton,
					onResendCodeClicked: props.onResendCodeClicked,
					children: [" ", /* @__PURE__ */ jsx(IdentityPreview, {
						identifier: props.safeIdentifier,
						avatarUrl: props.profileImageUrl,
						onClick: goBack,
						editButtonAriaLabel: props.identityPreviewEditButtonAriaLabel
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			props.cardNotice && /* @__PURE__ */ jsx(Alert, {
				colorScheme: "warning",
				children: /* @__PURE__ */ jsx(Text, {
					colorScheme: "warning",
					localizationKey: props.cardNotice,
					variant: "caption"
				})
			}),
			/* @__PURE__ */ jsx(Card.Action, {
				elementId: "alternativeMethods",
				children: props.onShowAlternativeMethodsClicked && /* @__PURE__ */ jsx(Card.ActionLink, {
					localizationKey: localizationKeys("footerActionLink__useAnotherMethod"),
					onClick: props.onShowAlternativeMethodsClicked
				})
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, {})] })
	});
};
const VerificationLink = (props) => {
	const card = useCardState();
	return /* @__PURE__ */ jsxs(Col, {
		elementDescriptor: descriptors.form,
		gap: 1,
		children: [/* @__PURE__ */ jsxs(Col, {
			elementDescriptor: descriptors.formHeader,
			gap: 1,
			children: [!!props.formSubtitle && /* @__PURE__ */ jsx(Text, {
				localizationKey: props.formSubtitle,
				elementDescriptor: descriptors.formHeaderSubtitle,
				colorScheme: "secondary"
			}), props.children]
		}), /* @__PURE__ */ jsx(TimerButton, {
			localizationKey: props.resendButton,
			elementDescriptor: descriptors.formResendCodeLink,
			onClick: props.onResendCodeClicked,
			startDisabled: true,
			isDisabled: card.isLoading,
			throttleTimeInSec: 60,
			sx: (theme) => ({
				marginTop: theme.space.$4,
				width: "100%"
			})
		})]
	});
};

//#endregion
export { VerificationLink, VerificationLinkCard };
//# sourceMappingURL=VerificationLinkCard.js.map