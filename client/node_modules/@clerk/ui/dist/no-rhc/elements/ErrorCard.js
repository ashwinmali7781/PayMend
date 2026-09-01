import { useRouter } from "../router/RouteContext.js";
import { localizationKeys } from "../localization/localizationKeys.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState } from "./contexts/index.js";
import { Flow } from "../customizables/Flow.js";
import { Button, Flex, Text } from "../customizables/index.js";
import { Card } from "./Card/index.js";
import { Header } from "./Header.js";
import { useSupportEmail } from "../hooks/useSupportEmail.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/ErrorCard.tsx
const ErrorCard = (props) => {
	const { shouldNavigateBack = true } = props;
	const card = useCardState();
	const { navigate } = useRouter();
	const supportEmail = useSupportEmail();
	const handleEmailSupport = () => {
		window.location.href = `mailto:${supportEmail}`;
	};
	const goBack = (e) => {
		if (props.onBackLinkClick) return props.onBackLinkClick(e);
		if (shouldNavigateBack) navigate("../");
	};
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "havingTrouble",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, {
				showLogo: true,
				children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: props.cardTitle || "Error" }), props.cardSubtitle && /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: props.cardSubtitle })]
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsxs(Flex, {
				direction: "col",
				elementDescriptor: descriptors.main,
				gap: 4,
				children: [
					props.message && /* @__PURE__ */ jsx(Text, {
						colorScheme: "secondary",
						localizationKey: props.message
					}),
					/* @__PURE__ */ jsx(Button, {
						localizationKey: localizationKeys("signIn.alternativeMethods.getHelp.blockButton__emailSupport"),
						onClick: handleEmailSupport,
						hasArrow: true
					}),
					shouldNavigateBack ? /* @__PURE__ */ jsx(Card.Action, {
						elementId: "alternativeMethods",
						children: /* @__PURE__ */ jsx(Card.ActionLink, {
							localizationKey: localizationKeys("backButton"),
							onClick: goBack
						})
					}) : null
				]
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, {})] })
	});
};

//#endregion
export { ErrorCard };
//# sourceMappingURL=ErrorCard.js.map