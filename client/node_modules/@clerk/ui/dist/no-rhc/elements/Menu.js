import { usePopover } from "../hooks/usePopover.js";
import { colors } from "../utils/colors/index.js";
import { animations } from "../styledSystem/animations.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { withFloatingTree } from "./contexts/index.js";
import { Col, SimpleButton } from "../customizables/index.js";
import { Popover } from "./Popover.js";
import React, { cloneElement, isValidElement, useRef } from "react";
import { createContextAndHook } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";
import { FloatingList, useClick, useInteractions, useListItem, useListNavigation, useMergeRefs, useRole } from "@floating-ui/react";

//#region src/elements/Menu.tsx
const [MenuStateCtx, useMenuState] = createContextAndHook("MenuState");
const Menu = withFloatingTree((props) => {
	const { popoverPlacement = "bottom-end", elementId, ...rest } = props;
	const popoverCtx = usePopover({
		placement: popoverPlacement,
		offset: 8,
		shoudFlip: true
	});
	const { context, isOpen } = popoverCtx;
	const [activeIndex, setActiveIndex] = React.useState(null);
	const elementsRef = useRef([]);
	React.useEffect(() => {
		if (!isOpen) setActiveIndex(null);
	}, [isOpen]);
	const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
		useClick(context),
		useRole(context, { role: "menu" }),
		useListNavigation(context, {
			listRef: elementsRef,
			activeIndex,
			onNavigate: setActiveIndex,
			loop: true
		})
	]);
	const value = React.useMemo(() => ({ value: {
		popoverCtx,
		elementId,
		getReferenceProps,
		getFloatingProps,
		getItemProps,
		activeIndex,
		elementsRef
	} }), [
		popoverCtx,
		elementId,
		getReferenceProps,
		getFloatingProps,
		getItemProps,
		activeIndex
	]);
	return /* @__PURE__ */ jsx(MenuStateCtx.Provider, {
		value,
		...rest
	});
});
const MenuTrigger = (props) => {
	const { children, ariaLabel } = props;
	const { popoverCtx, elementId, getReferenceProps } = useMenuState();
	const { reference, isOpen } = popoverCtx;
	const normalizedAriaLabel = typeof ariaLabel === "function" ? ariaLabel(isOpen) : ariaLabel;
	if (!isValidElement(children)) return null;
	return cloneElement(children, {
		ref: reference,
		elementDescriptor: children.props.elementDescriptor || descriptors.menuButton,
		elementId: children.props.elementId || descriptors.menuButton.setId(elementId),
		"aria-label": normalizedAriaLabel,
		...getReferenceProps({ onClick: children.props?.onClick })
	});
};
const MenuList = (props) => {
	const { sx, asPortal, ...rest } = props;
	const { popoverCtx, elementId, getFloatingProps, elementsRef } = useMenuState();
	const { floating, styles, isOpen, context, nodeId } = popoverCtx;
	const mergedRef = useMergeRefs([useRef(null), floating]);
	return /* @__PURE__ */ jsx(Popover, {
		context,
		nodeId,
		isOpen,
		portal: asPortal,
		order: ["content"],
		modal: false,
		children: /* @__PURE__ */ jsx(FloatingList, {
			elementsRef,
			children: /* @__PURE__ */ jsx(Col, {
				elementDescriptor: descriptors.menuList,
				elementId: descriptors.menuList.setId(elementId),
				ref: mergedRef,
				sx: [(t) => ({
					backgroundColor: colors.makeSolid(t.colors.$colorBackground),
					borderWidth: t.borderWidths.$normal,
					borderStyle: t.borderStyles.$solid,
					borderColor: t.colors.$borderAlpha150,
					outline: "none",
					borderRadius: t.radii.$md,
					padding: t.space.$0x5,
					overflow: "hidden",
					top: `calc(100% + ${t.space.$2})`,
					animation: `${animations.dropdownSlideInScaleAndFade} ${t.transitionDuration.$slower} ${t.transitionTiming.$slowBezier}`,
					transformOrigin: "top center",
					zIndex: t.zIndices.$dropdown,
					gap: t.space.$0x5
				}), sx],
				style: styles,
				...getFloatingProps(),
				...rest
			})
		})
	});
};
const MenuItem = (props) => {
	const { sx, onClick, destructive, closeAfterClick = true, ...rest } = props;
	const { popoverCtx, elementId, getItemProps, activeIndex } = useMenuState();
	const { toggle } = popoverCtx;
	const item = useListItem();
	const isActive = item.index === activeIndex;
	return /* @__PURE__ */ jsx(SimpleButton, {
		ref: item.ref,
		elementDescriptor: descriptors.menuItem,
		elementId: descriptors.menuItem.setId(elementId),
		hoverAsFocus: true,
		variant: "ghost",
		colorScheme: destructive ? "danger" : "neutral",
		role: "menuitem",
		tabIndex: isActive ? 0 : -1,
		focusRing: false,
		...getItemProps({ onClick: (e) => {
			onClick?.(e);
			if (closeAfterClick) toggle();
		} }),
		sx: [(theme) => ({
			justifyContent: "start",
			borderRadius: theme.radii.$sm,
			padding: `${theme.space.$1} ${theme.space.$3}`,
			whiteSpace: "nowrap",
			"&::after": {
				content: "\"\"",
				position: "absolute",
				inset: `calc(${theme.space.$0x25} * -1) calc(${theme.space.$1} * -1)`
			}
		}), sx],
		...rest
	});
};

//#endregion
export { Menu, MenuItem, MenuList, MenuTrigger };
//# sourceMappingURL=Menu.js.map