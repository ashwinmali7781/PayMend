import SvgArrowLeft from "../icons/arrow-left.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Badge, Col, Flex, Heading, Icon, Link, Text } from "../customizables/index.js";
import { ApplicationLogo } from "./ApplicationLogo.js";
import { VerticalDivider } from "./Divider.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Header.tsx
const Root = React.memo(React.forwardRef((props, ref) => {
	const { sx, children, contentSx, gap = 4, showLogo = false, showDivider = false, badgeText, ...rest } = props;
	const logoIsVisible = useAppearance().parsedOptions.logoPlacement === "inside" && showLogo;
	const verticalDividerIsVisible = showDivider && logoIsVisible;
	return /* @__PURE__ */ jsxs(Col, {
		ref,
		elementDescriptor: descriptors.header,
		gap,
		sx,
		...rest,
		children: [
			logoIsVisible && /* @__PURE__ */ jsx(ApplicationLogo, {}),
			verticalDividerIsVisible && /* @__PURE__ */ jsx(VerticalDivider, {}),
			badgeText && /* @__PURE__ */ jsx(Flex, {
				justify: "center",
				children: /* @__PURE__ */ jsx(Badge, { localizationKey: badgeText })
			}),
			/* @__PURE__ */ jsx(Col, {
				gap: 1,
				sx: contentSx,
				...rest,
				children
			})
		]
	});
}));
const Title = React.memo((props) => {
	const { sx, textVariant = "h2", ...rest } = props;
	return /* @__PURE__ */ jsx(Heading, {
		elementDescriptor: descriptors.headerTitle,
		textVariant,
		sx,
		...rest
	});
});
const Subtitle = React.memo((props) => {
	const { sx, ...rest } = props;
	return /* @__PURE__ */ jsx(Text, {
		elementDescriptor: descriptors.headerSubtitle,
		variant: "body",
		colorScheme: "secondary",
		sx: [{ wordWrap: "break-word" }, sx],
		...rest
	});
});
const BackLink = React.memo((props) => {
	const { sx, children, ...rest } = props;
	return /* @__PURE__ */ jsxs(Link, {
		elementDescriptor: descriptors.headerBackLink,
		sx: (t) => [{
			display: "inline-flex",
			alignItems: "center",
			gap: t.space.$2,
			width: "fit-content",
			"&:hover": { textDecoration: "none" }
		}, sx],
		...rest,
		children: [/* @__PURE__ */ jsx(Icon, {
			icon: SvgArrowLeft,
			sx: (t) => ({
				color: t.colors.$colorForeground,
				"[dir=\"rtl\"] &": { transform: "scaleX(-1)" }
			})
		}), children]
	});
});
const Header = {
	Root,
	Title,
	Subtitle,
	BackLink
};

//#endregion
export { Header };
//# sourceMappingURL=Header.js.map