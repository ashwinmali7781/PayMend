import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import SvgLogoMarkNew from "../../icons/logo-mark-new.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Col, Flex, Icon, Link, Text } from "../../customizables/index.js";
import { useDevMode } from "../../hooks/useDevMode.js";
import { DevModeNotice, DevModeOverlay } from "../DevModeNotice.js";
import { Card } from "./index.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Card/CardClerkAndPagesTag.tsx
const CardClerkAndPagesTag = React.memo(React.forwardRef((props, ref) => {
	const { sx, outerSx, withFooterPages = false, withDevOverlay = false, devModeNoticeSx, ...rest } = props;
	const { displayConfig } = useEnvironment();
	const { showDevModeNotice } = useDevMode();
	if (!(displayConfig.branded || withFooterPages) && !showDevModeNotice) return null;
	return /* @__PURE__ */ jsxs(Box, {
		elementDescriptor: descriptors.footerItem,
		sx: [{
			width: "100%",
			position: "relative"
		}, outerSx],
		children: [withDevOverlay && /* @__PURE__ */ jsx(DevModeOverlay, {}), /* @__PURE__ */ jsxs(Col, {
			sx: (t) => ({
				gap: displayConfig.branded || withFooterPages ? t.space.$4 : 0,
				marginInline: "auto",
				width: "100%",
				justifyContent: "center",
				alignItems: "center",
				position: "relative"
			}),
			children: [(displayConfig.branded || withFooterPages) && /* @__PURE__ */ jsxs(Flex, {
				sx: [{
					":has(div:only-child)": { justifyContent: "center" },
					justifyContent: "space-between",
					width: "100%"
				}, sx],
				...rest,
				ref,
				children: [displayConfig.branded && /* @__PURE__ */ jsx(Flex, {
					gap: 1,
					align: "center",
					justify: "center",
					sx: (t) => ({ color: t.colors.$colorMutedForeground }),
					children: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Text, {
						variant: "buttonSmall",
						children: "Secured by"
					}), /* @__PURE__ */ jsx(LogoMarkIconLink, {})] })
				}), withFooterPages && /* @__PURE__ */ jsx(Card.FooterLinks, {})]
			}), /* @__PURE__ */ jsx(DevModeNotice, { sx: devModeNoticeSx })]
		})]
	});
}));
const LogoMarkIconLink = () => {
	return /* @__PURE__ */ jsx(Link, {
		href: "https://go.clerk.com/components",
		colorScheme: "inherit",
		isExternal: true,
		"aria-label": "Clerk logo",
		children: /* @__PURE__ */ jsx(Icon, {
			icon: SvgLogoMarkNew,
			sx: (theme) => ({
				width: theme.sizes.$12,
				height: theme.sizes.$3x5
			})
		})
	});
};

//#endregion
export { CardClerkAndPagesTag };
//# sourceMappingURL=CardClerkAndPagesTag.js.map