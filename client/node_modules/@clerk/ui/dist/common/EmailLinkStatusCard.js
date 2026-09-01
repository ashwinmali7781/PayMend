import SvgArrowLeftRight from "../icons/arrow-left-right.js";
import SvgExclamationTriangle from "../icons/exclamation-triangle.js";
import SvgShieldCheck from "../icons/shield-check.js";
import { localizationKeys } from "../localization/localizationKeys.js";
import { animations } from "../styledSystem/animations.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flow } from "../customizables/Flow.js";
import { Col, Flex, Icon, Spinner, Text } from "../customizables/index.js";
import { useCardState } from "../elements/contexts/index.js";
import { Card } from "../elements/Card/index.js";
import { Header } from "../elements/Header.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/common/EmailLinkStatusCard.tsx
const StatusToIcon = {
	verified: SvgShieldCheck,
	verified_switch_tab: SvgArrowLeftRight,
	transferable: SvgArrowLeftRight,
	expired: SvgExclamationTriangle,
	failed: SvgExclamationTriangle,
	client_mismatch: SvgExclamationTriangle
};
const statusToColor = (theme, status) => ({
	verified: theme.colors.$success500,
	verified_switch_tab: theme.colors.$primary500,
	transferable: theme.colors.$primary500,
	expired: theme.colors.$warning500,
	failed: theme.colors.$danger500,
	client_mismatch: theme.colors.$warning500
})[status];
const EmailLinkStatusCard = (props) => {
	const card = useCardState();
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "emailLinkStatus",
		children: /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
			/* @__PURE__ */ jsxs(Header.Root, { children: [/* @__PURE__ */ jsx(Header.Title, { localizationKey: props.title }), /* @__PURE__ */ jsx(Header.Subtitle, { localizationKey: props.subtitle })] }),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsx(Col, {
				elementDescriptor: descriptors.main,
				children: /* @__PURE__ */ jsx(StatusRow, { status: props.status })
			})
		] }), /* @__PURE__ */ jsx(Card.Footer, {})] })
	});
};
const StatusRow = (props) => {
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.verificationLinkStatusBox,
		center: true,
		direction: "col",
		gap: 8,
		children: props.status === "loading" ? /* @__PURE__ */ jsx(Spinner, {
			size: "xl",
			colorScheme: "primary",
			sx: (theme) => ({ margin: `${theme.space.$12} 0` }),
			elementDescriptor: descriptors.spinner
		}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(StatusIcon, { status: props.status }), /* @__PURE__ */ jsx(Text, {
			elementDescriptor: descriptors.verificationLinkStatusText,
			colorScheme: "secondary",
			localizationKey: localizationKeys("signIn.emailLink.unusedTab.title")
		})] })
	});
};
const StatusIcon = (props) => {
	const { status } = props;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.verificationLinkStatusIconBox,
		center: true,
		sx: (theme) => ({
			width: theme.sizes.$24,
			height: theme.sizes.$24,
			borderRadius: theme.radii.$circle,
			backgroundColor: theme.colors.$neutralAlpha100,
			color: statusToColor(theme, status),
			animation: `${animations.dropdownSlideInScaleAndFade} 500ms ease`
		}),
		children: /* @__PURE__ */ jsx(Icon, {
			elementDescriptor: descriptors.verificationLinkStatusIcon,
			icon: StatusToIcon[status],
			sx: (theme) => ({
				height: theme.sizes.$6,
				width: theme.sizes.$5
			})
		})
	});
};

//#endregion
export { EmailLinkStatusCard };
//# sourceMappingURL=EmailLinkStatusCard.js.map