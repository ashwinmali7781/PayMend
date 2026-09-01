import SvgClose from "../icons/close.js";
import { useDirection } from "../hooks/useDirection.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useScrollLock } from "../hooks/useScrollLock.js";
import { colors } from "../utils/colors/index.js";
import { transitionDurationValues, transitionTiming } from "../foundations/transitions.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { common } from "../styledSystem/common.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Box, Flex, Heading, Icon, Span } from "../customizables/index.js";
import { IconButton } from "./IconButton.js";
import * as React$1 from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";
import { FloatingFocusManager, FloatingNode, FloatingPortal, FloatingTree, useClick, useDismiss, useFloating, useFloatingNodeId, useFloatingParentNodeId, useInteractions, useMergeRefs, useRole, useTransitionStyles } from "@floating-ui/react";
import { usePortalRoot, useSafeLayoutEffect } from "@clerk/shared/react/index";

//#region src/elements/Drawer.tsx
const DrawerContext = React$1.createContext(null);
const useDrawerContext = () => {
	const context = React$1.useContext(DrawerContext);
	if (!context) throw new Error("Drawer components must be wrapped in <Drawer.Root>");
	return context;
};
function Root(props) {
	if (useFloatingParentNodeId() == null) return /* @__PURE__ */ jsx(FloatingTree, { children: /* @__PURE__ */ jsx(RootContent, { ...props }) });
	return /* @__PURE__ */ jsx(RootContent, { ...props });
}
function RootContent({ children, open, onOpenChange, strategy = "fixed", floatingProps, portalProps, dismissProps }) {
	const direction = useDirection();
	const portalRoot = usePortalRoot();
	const effectivePortalRoot = portalProps?.root ?? portalRoot?.() ?? void 0;
	const nodeId = useFloatingNodeId();
	const { refs, context } = useFloating({
		open,
		onOpenChange,
		nodeId,
		transform: false,
		strategy,
		placement: direction === "ltr" ? "right" : "left",
		...floatingProps
	});
	const { getFloatingProps } = useInteractions([
		useClick(context),
		useDismiss(context, dismissProps),
		useRole(context)
	]);
	return /* @__PURE__ */ jsx(FloatingNode, {
		id: nodeId,
		children: /* @__PURE__ */ jsx(DrawerContext.Provider, {
			value: {
				isOpen: open,
				setIsOpen: onOpenChange,
				strategy,
				portalProps: {
					...portalProps,
					root: effectivePortalRoot
				},
				refs,
				context,
				getFloatingProps,
				direction
			},
			children: /* @__PURE__ */ jsx(FloatingPortal, {
				...portalProps,
				root: effectivePortalRoot,
				children
			})
		})
	});
}
const FloatingOverlay = React$1.forwardRef(function FloatingOverlay(props, ref) {
	const { strategy } = useDrawerContext();
	const { disableScrollLock, enableScrollLock } = useScrollLock();
	useSafeLayoutEffect(() => {
		if (strategy !== "fixed") return;
		enableScrollLock();
		return () => {
			disableScrollLock();
		};
	}, [
		strategy,
		disableScrollLock,
		enableScrollLock
	]);
	return /* @__PURE__ */ jsx(Box, {
		ref,
		...props,
		elementDescriptor: descriptors.drawerBackdrop,
		sx: [(t) => ({
			inset: 0,
			zIndex: t.zIndices.$modal,
			backgroundColor: colors.setAlpha(t.colors.$colorBackground, .28)
		}), props.sx]
	});
});
const Overlay = React$1.forwardRef((_, ref) => {
	const { strategy, context } = useDrawerContext();
	const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
		initial: { opacity: 0 },
		open: { opacity: 1 },
		close: { opacity: 0 },
		common: {
			position: strategy,
			inset: 0,
			transitionProperty: "opacity",
			transitionTimingFunction: transitionTiming.bezier
		},
		duration: transitionDurationValues.drawer
	});
	if (!isMounted) return null;
	return /* @__PURE__ */ jsx(FloatingOverlay, {
		ref,
		style: { ...transitionStyles }
	});
});
Overlay.displayName = "Drawer.Overlay";
const Content = React$1.forwardRef(({ children }, ref) => {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { animations: layoutAnimations } = useAppearance().parsedOptions;
	const isMotionSafe = !prefersReducedMotion && layoutAnimations === true;
	const { strategy, refs, context, getFloatingProps, direction } = useDrawerContext();
	const mergedRefs = useMergeRefs([ref, refs.setFloating]);
	const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
		initial: { transform: `translate3d(var(--transform-offset), 0, 0)` },
		open: { transform: "translate3d(0, 0, 0)" },
		close: { transform: `translate3d(var(--transform-offset), 0, 0)` },
		common: {
			transitionProperty: "transform",
			transitionTimingFunction: transitionTiming.bezier
		},
		duration: isMotionSafe ? transitionDurationValues.drawer : 0
	});
	if (!isMounted) return null;
	return /* @__PURE__ */ jsx(FloatingFocusManager, {
		context,
		modal: true,
		outsideElementsInert: true,
		initialFocus: refs.floating,
		children: /* @__PURE__ */ jsx(Box, {
			ref: mergedRefs,
			...getFloatingProps(),
			sx: (t) => ({
				position: strategy,
				insetBlock: 0,
				insetInline: 0,
				pointerEvents: "none",
				isolation: "isolate",
				zIndex: t.zIndices.$modal
			}),
			elementDescriptor: descriptors.drawerRoot,
			children: /* @__PURE__ */ jsx(Flex, {
				elementDescriptor: descriptors.drawerContent,
				style: transitionStyles,
				direction: "col",
				sx: (t) => ({
					"--transform-offset": strategy === "fixed" ? `calc((100% + ${t.space.$3} + ${t.space.$8x75}) * ${direction === "rtl" ? -1 : 1})` : `calc((100% + ${t.space.$8x75}) * ${direction === "rtl" ? -1 : 1})`,
					willChange: "transform",
					position: strategy,
					insetBlock: strategy === "fixed" ? t.space.$3 : 0,
					insetInlineEnd: strategy === "fixed" ? t.space.$3 : 0,
					outline: 0,
					width: t.sizes.$100,
					maxWidth: strategy === "fixed" ? `calc(100% - ${t.space.$6})` : "100%",
					backgroundColor: t.colors.$colorBackground,
					borderStartStartRadius: t.radii.$lg,
					borderEndStartRadius: t.radii.$lg,
					borderEndEndRadius: strategy === "fixed" ? t.radii.$lg : 0,
					borderStartEndRadius: strategy === "fixed" ? t.radii.$lg : 0,
					borderWidth: t.borderWidths.$normal,
					borderStyle: t.borderStyles.$solid,
					borderColor: t.colors.$borderAlpha150,
					overflow: "hidden",
					pointerEvents: "auto"
				}),
				children
			})
		})
	});
});
Content.displayName = "Drawer.Content";
const Header = React$1.forwardRef(({ title, children, sx }, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		ref,
		elementDescriptor: descriptors.drawerHeader,
		as: "header",
		sx: [(t) => ({
			display: "flex",
			background: common.mergedColorsBackground(colors.setAlpha(t.colors.$colorBackground, 1), t.colors.$neutralAlpha50),
			borderBlockEndWidth: t.borderWidths.$normal,
			borderBlockEndStyle: t.borderStyles.$solid,
			borderBlockEndColor: t.colors.$borderAlpha150,
			borderStartStartRadius: t.radii.$lg,
			borderStartEndRadius: t.radii.$lg,
			paddingBlock: title ? t.space.$3 : void 0,
			paddingInline: title ? t.space.$4 : void 0
		}), sx],
		children: title ? /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Heading, {
			localizationKey: title,
			as: "h2",
			elementDescriptor: descriptors.drawerTitle,
			textVariant: "h2",
			sx: { alignSelf: "center" }
		}), /* @__PURE__ */ jsx(Close, {})] }) : children
	});
});
const Body = React$1.forwardRef(({ children, ...props }, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		ref,
		elementDescriptor: descriptors.drawerBody,
		sx: [() => ({
			display: "flex",
			flexDirection: "column",
			flex: 1,
			overflowY: "auto",
			overflowX: "hidden"
		}), props.sx],
		...props,
		children
	});
});
const Footer = React$1.forwardRef(({ children, sx, ...props }, ref) => {
	return /* @__PURE__ */ jsx(Box, {
		ref,
		elementDescriptor: descriptors.drawerFooter,
		sx: [(t) => ({
			display: "flex",
			flexDirection: "column",
			background: common.mergedColorsBackground(colors.setAlpha(t.colors.$colorBackground, 1), t.colors.$neutralAlpha50),
			borderBlockStartWidth: t.borderWidths.$normal,
			borderBlockStartStyle: t.borderStyles.$solid,
			borderBlockStartColor: t.colors.$borderAlpha100,
			borderEndStartRadius: t.radii.$xl,
			borderEndEndRadius: t.radii.$xl,
			paddingBlock: t.space.$3,
			paddingInline: t.space.$4
		}), sx],
		...props,
		children
	});
});
const Close = React$1.forwardRef((_, ref) => {
	const { setIsOpen } = useDrawerContext();
	return /* @__PURE__ */ jsx(IconButton, {
		ref,
		elementDescriptor: descriptors.drawerClose,
		variant: "ghost",
		"aria-label": "Close drawer",
		onClick: () => setIsOpen(false),
		icon: /* @__PURE__ */ jsx(Icon, { icon: SvgClose }),
		sx: (t) => ({
			color: t.colors.$colorMutedForeground,
			padding: t.space.$3,
			marginInlineStart: "auto"
		})
	});
});
Close.displayName = "Drawer.Close";
const Confirmation = React$1.forwardRef(({ open, onOpenChange, children, actionsSlot, roleProps }, ref) => {
	const prefersReducedMotion = usePrefersReducedMotion();
	const { animations: layoutAnimations } = useAppearance().parsedOptions;
	const isMotionSafe = !prefersReducedMotion && layoutAnimations === true;
	const { refs, context } = useFloating({
		open,
		onOpenChange,
		transform: false,
		strategy: "absolute"
	});
	const { getFloatingProps } = useInteractions([
		useClick(context),
		useDismiss(context),
		useRole(context, {
			role: "alertdialog",
			...roleProps
		})
	]);
	const mergedRefs = useMergeRefs([ref, refs.setFloating]);
	const { styles: overlayTransitionStyles } = useTransitionStyles(context, {
		initial: { opacity: 0 },
		open: { opacity: 1 },
		close: { opacity: 0 },
		common: {
			transitionProperty: "opacity",
			transitionTimingFunction: transitionTiming.bezier
		},
		duration: transitionDurationValues.drawer
	});
	const { isMounted, styles: modalTransitionStyles } = useTransitionStyles(context, {
		initial: { transform: "translate3D(0, 100%, 0)" },
		open: { transform: "translate3D(0, 0, 0)" },
		close: { transform: "translate3D(0, 100%, 0)" },
		common: {
			transitionProperty: "transform",
			transitionTimingFunction: transitionTiming.bezier
		},
		duration: isMotionSafe ? transitionDurationValues.drawer : 0
	});
	if (!isMounted) return null;
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(Span, {
		elementDescriptor: descriptors.drawerConfirmationBackdrop,
		style: overlayTransitionStyles,
		sx: (t) => ({
			position: "absolute",
			inset: 0,
			backgroundImage: `linear-gradient(to bottom, ${colors.setAlpha(t.colors.$colorBackground, .28)}, ${t.colors.$colorBackground})`
		})
	}), /* @__PURE__ */ jsx(FloatingFocusManager, {
		context,
		modal: true,
		outsideElementsInert: true,
		initialFocus: refs.floating,
		children: /* @__PURE__ */ jsxs(Box, {
			ref: mergedRefs,
			elementDescriptor: descriptors.drawerConfirmationRoot,
			style: modalTransitionStyles,
			...getFloatingProps(),
			sx: (t) => ({
				display: "flex",
				flexDirection: "column",
				rowGap: t.space.$6,
				outline: "none",
				willChange: "transform",
				position: "absolute",
				bottom: 0,
				left: 0,
				right: 0,
				background: common.mergedColorsBackground(colors.setAlpha(t.colors.$colorBackground, 1), t.colors.$neutralAlpha50),
				padding: t.space.$4,
				borderStartStartRadius: t.radii.$md,
				borderStartEndRadius: t.radii.$md,
				boxShadow: `0 0 0 1px ${t.colors.$borderAlpha100}`
			}),
			children: [children, /* @__PURE__ */ jsx(Flex, {
				elementDescriptor: descriptors.drawerConfirmationActions,
				gap: 3,
				justify: "end",
				children: actionsSlot
			})]
		})
	})] });
});
Confirmation.displayName = "Drawer.Confirmation";
const Drawer = {
	Root,
	Overlay,
	Content,
	Header,
	Body,
	Footer,
	Confirmation,
	Close
};

//#endregion
export { Drawer, useDrawerContext };
//# sourceMappingURL=Drawer.js.map