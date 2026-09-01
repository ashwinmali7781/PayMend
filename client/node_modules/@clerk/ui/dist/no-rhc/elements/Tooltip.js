import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import { useAppearance } from "../customizables/AppearanceContext.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { withFloatingTree } from "./contexts/index.js";
import { Box, Span, Text } from "../customizables/index.js";
import * as React$1 from "react";
import { usePortalRoot } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";
import { FloatingNode, FloatingPortal, autoUpdate, flip, offset, shift, useDismiss, useFloating, useFloatingNodeId, useFocus, useHover, useInteractions, useMergeRefs, useRole, useTransitionStyles } from "@floating-ui/react";

//#region src/elements/Tooltip.tsx
function useTooltip({ initialOpen = false, placement = "top", open: controlledOpen, onOpenChange: setControlledOpen } = {}) {
	const [uncontrolledOpen, setUncontrolledOpen] = React$1.useState(initialOpen);
	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = setControlledOpen ?? setUncontrolledOpen;
	const prefersReducedMotion = usePrefersReducedMotion();
	const { animations: layoutAnimations } = useAppearance().parsedOptions;
	const isMotionSafe = !prefersReducedMotion && layoutAnimations === true;
	const nodeId = useFloatingNodeId();
	const data = useFloating({
		nodeId,
		placement,
		open,
		onOpenChange: setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(6),
			flip({
				crossAxis: placement.includes("-"),
				fallbackAxisSideDirection: "start",
				padding: 6
			}),
			shift({ padding: 6 })
		]
	});
	const context = data.context;
	const hover = useHover(context, {
		move: false,
		enabled: controlledOpen == null
	});
	const focus = useFocus(context, { enabled: controlledOpen == null });
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "tooltip" });
	const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
		duration: isMotionSafe ? 200 : 0,
		initial: ({ side }) => {
			return {
				opacity: 0,
				transform: side === "top" ? "translateY(4px)" : "translateY(-4px)"
			};
		},
		open: {
			opacity: 1,
			transform: "translate(0)"
		},
		close: ({ side }) => ({
			opacity: 0,
			transform: side === "top" ? "translateY(4px)" : "translateY(-4px)"
		})
	});
	const interactions = useInteractions([
		hover,
		focus,
		dismiss,
		role
	]);
	return React$1.useMemo(() => ({
		open,
		setOpen,
		isMounted,
		nodeId,
		...interactions,
		...data,
		transitionStyles
	}), [
		open,
		setOpen,
		interactions,
		data,
		isMounted,
		transitionStyles,
		nodeId
	]);
}
const TooltipContext = React$1.createContext(null);
const useTooltipContext = () => {
	const context = React$1.useContext(TooltipContext);
	if (context == null) throw new Error("Tooltip components must be wrapped in <Tooltip />");
	return context;
};
const Root = withFloatingTree(({ children, ...options }) => {
	const tooltip = useTooltip(options);
	return /* @__PURE__ */ jsx(TooltipContext.Provider, {
		value: tooltip,
		children
	});
});
const Trigger = React$1.forwardRef(function TooltipTrigger({ children, sx, ...props }, propRef) {
	const context = useTooltipContext();
	const childrenRef = children.ref;
	const ref = useMergeRefs([
		context.refs.setReference,
		propRef,
		childrenRef
	]);
	if (!React$1.isValidElement(children)) return null;
	if (children.props.isDisabled || children.props.disabled) return /* @__PURE__ */ jsx(Span, {
		ref,
		...context.getReferenceProps({ ...props }),
		"data-state": context.open ? "open" : "closed",
		sx: [{
			width: "fit-content",
			display: "inline-block",
			cursor: "not-allowed",
			outline: "none"
		}, sx],
		tabIndex: 0,
		children
	});
	return React$1.cloneElement(children, context.getReferenceProps({
		ref,
		...props,
		...children.props,
		"data-state": context.open ? "open" : "closed"
	}));
});
const Content = React$1.forwardRef(function TooltipContent({ style, text, sx, textSx, ...props }, propRef) {
	const context = useTooltipContext();
	const ref = useMergeRefs([context.refs.setFloating, propRef]);
	const effectiveRoot = usePortalRoot()?.() ?? void 0;
	if (!context.isMounted) return null;
	return /* @__PURE__ */ jsx(FloatingNode, {
		id: context.nodeId,
		children: /* @__PURE__ */ jsx(FloatingPortal, {
			root: effectiveRoot,
			children: /* @__PURE__ */ jsx(Box, {
				ref,
				elementDescriptor: descriptors.tooltip,
				style: {
					...context.floatingStyles,
					...style
				},
				...context.getFloatingProps(props),
				sx: (t) => ({ zIndex: t.zIndices.$tooltip }),
				children: /* @__PURE__ */ jsx(Box, {
					elementDescriptor: descriptors.tooltipContent,
					style: context.transitionStyles,
					sx: [(t) => ({
						paddingBlock: t.space.$1,
						paddingInline: t.space.$1x5,
						borderRadius: t.radii.$md,
						backgroundColor: t.colors.$black,
						color: t.colors.$white,
						maxWidth: t.sizes.$60
					}), sx],
					children: /* @__PURE__ */ jsx(Text, {
						elementDescriptor: descriptors.tooltipText,
						localizationKey: text,
						variant: "body",
						colorScheme: "inherit",
						sx: textSx
					})
				})
			})
		})
	});
});
const Tooltip = {
	Root,
	Trigger,
	Content
};

//#endregion
export { Tooltip };
//# sourceMappingURL=Tooltip.js.map