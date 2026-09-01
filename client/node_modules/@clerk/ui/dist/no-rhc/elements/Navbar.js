import { useRouter } from "../router/RouteContext.js";
import { useNavigateToFlowStart } from "../hooks/useNavigateToFlowStart.js";
import { usePopover } from "../hooks/usePopover.js";
import SvgMenu from "../icons/menu.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { colors } from "../utils/colors/index.js";
import { common } from "../styledSystem/common.js";
import { animations } from "../styledSystem/animations.js";
import { mqu } from "../styledSystem/breakpoints.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { withFloatingTree } from "./contexts/index.js";
import { Button, Col, Flex, Heading, Icon, Span, Text } from "../customizables/index.js";
import { DevModeOverlay } from "./DevModeNotice.js";
import { Popover } from "./Popover.js";
import { Card } from "./Card/index.js";
import React, { useCallback } from "react";
import { createContextAndHook } from "@clerk/shared/react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Navbar.tsx
const [NavbarContext, useNavbarContext, useUnsafeNavbarContext] = createContextAndHook("NavbarContext");
const NavbarContextProvider = ({ children, contentRef }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const open = React.useCallback(() => setIsOpen(true), []);
	const close = React.useCallback(() => setIsOpen(false), []);
	const value = React.useMemo(() => ({ value: {
		isOpen,
		open,
		close,
		contentRef
	} }), [isOpen]);
	return /* @__PURE__ */ jsx(NavbarContext.Provider, {
		value,
		children
	});
};
const NavBar = (props) => {
	const { contentRef, title, titleSx, containerSx, description, routes, header } = props;
	const { close } = useNavbarContext();
	const { navigate } = useRouter();
	const { navigateToFlowStart } = useNavigateToFlowStart();
	const router = useRouter();
	const handleNavigate = (route) => {
		if (route?.external) return () => navigate(route.path);
		else return () => navigateToInternalRoute(route);
	};
	const navigateToInternalRoute = async (route) => {
		if (contentRef.current) {
			close();
			if (route.path === "/") await navigateToFlowStart();
			else await navigate(route.path);
		}
	};
	const checkIfActive = useCallback((a) => {
		if (a.external) return false;
		const isRoot = router.currentPath === router.fullPath && a.path === "/";
		const matchesPath = router.matches(a.path);
		return isRoot || matchesPath;
	}, [router.currentPath]);
	const items = routes.length > 0 ? /* @__PURE__ */ jsx(Col, {
		elementDescriptor: descriptors.navbarButtons,
		sx: (t) => ({ gap: t.space.$0x5 }),
		children: routes.map((r) => /* @__PURE__ */ jsx(NavButton, {
			elementDescriptor: descriptors.navbarButton,
			elementId: descriptors.navbarButton.setId(r.id),
			iconElementDescriptor: descriptors.navbarButtonIcon,
			iconElementId: descriptors.navbarButtonIcon.setId(r.id),
			onClick: handleNavigate(r),
			icon: r.icon,
			isActive: checkIfActive(r),
			sx: (t) => ({
				padding: `${t.space.$1x5} ${t.space.$3}`,
				minHeight: t.space.$8
			}),
			children: /* @__PURE__ */ jsx(Span, {
				elementDescriptor: descriptors.navbarButtonText,
				elementId: descriptors.navbarButtonText.setId(r.id),
				localizationKey: r.name
			})
		}, r.id))
	}) : null;
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs(NavbarContainer, {
		title,
		titleSx,
		containerSx,
		description,
		children: [header, items]
	}), /* @__PURE__ */ jsxs(MobileNavbarContainer, { children: [header, items] })] });
};
const NavbarContainer = (props) => {
	const { title, titleSx, containerSx, description } = props;
	return /* @__PURE__ */ jsxs(Col, {
		elementDescriptor: descriptors.navbar,
		sx: (t) => ({
			[mqu.md]: { display: "none" },
			flex: `0 0 ${t.space.$57}`,
			width: t.sizes.$57,
			position: "relative",
			maxWidth: t.space.$57,
			background: common.mutedBackground(t),
			padding: `${t.space.$6} ${t.space.$5} ${t.space.$4} ${t.space.$3}`,
			marginInlineEnd: `calc(${t.space.$2} * -1)`,
			color: t.colors.$colorForeground,
			justifyContent: "space-between"
		}),
		children: [
			/* @__PURE__ */ jsx(DevModeOverlay, {}),
			/* @__PURE__ */ jsxs(Col, {
				sx: [(t) => ({
					gap: t.space.$6,
					flex: `0 0 ${t.space.$60}`
				}), containerSx],
				children: [/* @__PURE__ */ jsxs(Col, {
					sx: (t) => ({
						gap: t.space.$0x5,
						padding: `${t.space.$none} ${t.space.$3}`
					}),
					children: [/* @__PURE__ */ jsx(Heading, {
						as: "h1",
						sx: titleSx,
						localizationKey: title
					}), description ? /* @__PURE__ */ jsx(Text, {
						colorScheme: "secondary",
						localizationKey: description
					}) : null]
				}), props.children]
			}),
			/* @__PURE__ */ jsx(Card.ClerkAndPagesTag, {
				sx: { width: "fit-content" },
				devModeNoticeSx: (t) => ({
					padding: t.space.$none,
					marginBottom: `calc(${t.space.$1} * -1)`
				})
			})
		]
	});
};
const MobileNavbarContainer = withFloatingTree((props) => {
	const navbarContext = useNavbarContext();
	const { floating, isOpen, open, close, nodeId, context } = usePopover({
		defaultOpen: false,
		autoUpdate: false
	});
	React.useEffect(() => {
		if (navbarContext.isOpen) open();
		else close();
	}, [navbarContext.isOpen]);
	React.useEffect(() => {
		if (!isOpen) navbarContext.close();
	}, [isOpen]);
	return /* @__PURE__ */ jsx(Popover, {
		nodeId,
		context,
		isOpen,
		portal: false,
		children: /* @__PURE__ */ jsx(Col, {
			sx: (t) => ({
				position: "absolute",
				top: 0,
				bottom: 0,
				width: "100%",
				zIndex: t.zIndices.$navbar,
				overflow: "hidden",
				color: t.colors.$colorForeground
			}),
			children: /* @__PURE__ */ jsx(Col, {
				ref: floating,
				elementDescriptor: descriptors.navbar,
				tabIndex: 0,
				sx: (t) => ({
					outline: 0,
					position: "absolute",
					top: 0,
					bottom: 0,
					width: t.space.$60,
					backgroundColor: colors.makeSolid(t.colors.$colorBackground),
					borderStartEndRadius: t.radii.$lg,
					borderEndEndRadius: t.radii.$lg,
					padding: `${t.space.$10} ${t.space.$6}`,
					animation: `${animations.navbarSlideIn} ${t.transitionDuration.$slower} ${t.transitionTiming.$slowBezier}`,
					borderInlineEndWidth: t.borderWidths.$normal,
					borderInlineEndStyle: t.borderStyles.$solid,
					borderInlineEndColor: t.colors.$borderAlpha150,
					boxShadow: t.shadows.$cardContentShadow
				}),
				children: props.children
			})
		})
	});
});
const NavButton = (props) => {
	const { icon, children, isActive, iconElementDescriptor, iconElementId, sx, ...rest } = props;
	return /* @__PURE__ */ jsxs(Button, {
		variant: "unstyled",
		colorScheme: isActive ? "primary" : "neutral",
		textVariant: "buttonLarge",
		size: "md",
		isActive,
		focusRing: false,
		...rest,
		sx: [(t) => ({
			gap: t.space.$3,
			justifyContent: "flex-start",
			backgroundColor: isActive ? t.colors.$neutralAlpha100 : void 0,
			color: isActive ? t.colors.$primary500 : t.colors.$colorMutedForeground,
			"&:hover": { backgroundColor: isActive ? void 0 : t.colors.$neutralAlpha25 },
			"&:focus-visible": { backgroundColor: isActive ? void 0 : t.colors.$neutralAlpha50 }
		}), sx],
		children: [/* @__PURE__ */ jsx(Icon, {
			elementDescriptor: iconElementDescriptor,
			elementId: iconElementId,
			icon,
			sx: {
				opacity: isActive ? 1 : .7,
				transform: "translateZ(0)"
			}
		}), children]
	});
};
const NavbarMenuButtonRow = ({ navbarTitleLocalizationKey, ...props }) => {
	const { open } = useUnsafeNavbarContext();
	const { t } = useLocalizations();
	if (!!!open) return null;
	return /* @__PURE__ */ jsx(Flex, {
		elementDescriptor: descriptors.navbarMobileMenuRow,
		sx: (t) => ({
			display: "none",
			background: common.mutedBackground(t),
			padding: `${t.space.$2} ${t.space.$3} ${t.space.$4} ${t.space.$3}`,
			marginBottom: `calc(${t.space.$2} * -1)`,
			[mqu.md]: { display: "flex" }
		}),
		children: /* @__PURE__ */ jsxs(Button, {
			elementDescriptor: descriptors.navbarMobileMenuButton,
			...props,
			onClick: open,
			size: "xs",
			textVariant: "h2",
			variant: "ghost",
			sx: (t) => ({
				color: t.colors.$colorForeground,
				gap: t.space.$2x5,
				width: "fit-content",
				alignItems: "center",
				justifyContent: "center"
			}),
			children: [/* @__PURE__ */ jsx(Icon, {
				elementDescriptor: descriptors.navbarMobileMenuButtonIcon,
				icon: SvgMenu,
				size: "md"
			}), t(navbarTitleLocalizationKey)]
		})
	});
};

//#endregion
export { NavBar, NavbarContextProvider, NavbarMenuButtonRow, useUnsafeNavbarContext };
//# sourceMappingURL=Navbar.js.map