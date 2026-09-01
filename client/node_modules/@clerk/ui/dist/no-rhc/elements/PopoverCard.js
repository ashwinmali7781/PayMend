import { useEnvironment } from "../contexts/EnvironmentContext.js";
import { colors } from "../utils/colors/index.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { common } from "../styledSystem/common.js";
import { animations } from "../styledSystem/animations.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Flow } from "../customizables/Flow.js";
import { Col, Flex } from "../customizables/index.js";
import { Card } from "./Card/index.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/PopoverCard.tsx
const PopoverCardRoot = React.forwardRef((props, ref) => {
	const { elementDescriptor, shouldEntryAnimate = true, ...rest } = props;
	const withAnimation = (t) => ({ animation: shouldEntryAnimate ? `${animations.dropdownSlideInScaleAndFade} ${t.transitionDuration.$fast}` : void 0 });
	return /* @__PURE__ */ jsx(Flow.Part, {
		part: "popover",
		children: /* @__PURE__ */ jsx(Card.Root, {
			elementDescriptor: [descriptors.popoverBox, elementDescriptor],
			...rest,
			ref,
			elevation: "raised",
			sx: [(t) => ({
				width: t.sizes.$94,
				maxWidth: `calc(100vw - ${t.sizes.$8})`,
				zIndex: t.zIndices.$modal,
				borderRadius: t.radii.$xl,
				outline: "none"
			}), withAnimation],
			children: props.children
		})
	});
});
const PopoverCardContent = (props) => {
	const { sx, ...rest } = props;
	return /* @__PURE__ */ jsx(Flex, {
		direction: "col",
		sx: [(t) => ({
			backgroundColor: t.colors.$colorBackground,
			overflow: "hidden",
			borderRadius: t.radii.$lg,
			zIndex: t.zIndices.$card,
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha150,
			marginInline: "-1px",
			marginBlockStart: "-1px"
		}), sx],
		...rest,
		children: props.children
	});
};
const PopoverCardFooter = (props) => {
	const { sx, children, ...rest } = props;
	const { branded } = useEnvironment().displayConfig;
	const { privacyPageUrl, termsPageUrl, helpPageUrl } = useAppearance().parsedOptions;
	const shouldShowTagOrLinks = branded || privacyPageUrl || termsPageUrl || helpPageUrl;
	return /* @__PURE__ */ jsxs(Col, {
		justify: "between",
		sx: [(t) => ({
			background: common.mergedColorsBackground(colors.setAlpha(t.colors.$colorBackground, 1), t.colors.$neutralAlpha50),
			marginTop: `calc(${t.space.$2} * -1)`,
			paddingTop: t.space.$2,
			"&:empty": {
				padding: 0,
				marginTop: 0
			},
			">:not(:first-of-type)": {
				padding: `${t.space.$4} ${t.space.$8}`,
				borderTopWidth: t.borderWidths.$normal,
				borderTopStyle: t.borderStyles.$solid,
				borderTopColor: t.colors.$borderAlpha100
			}
		}), sx],
		...rest,
		children: [children, /* @__PURE__ */ jsx(Card.ClerkAndPagesTag, {
			outerSx: (t) => ({ padding: `${t.space.$4} ${t.space.$8}` }),
			withFooterPages: !!shouldShowTagOrLinks,
			devModeNoticeSx: (t) => ({ padding: t.space.$none }),
			withDevOverlay: true
		})]
	});
};
const PopoverCard = {
	Root: PopoverCardRoot,
	Content: PopoverCardContent,
	Footer: PopoverCardFooter
};

//#endregion
export { PopoverCard };
//# sourceMappingURL=PopoverCard.js.map