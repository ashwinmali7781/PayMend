import React, { useEffect } from "react";
import { autoUpdate, flip, offset, shift, size, useClick, useDismiss, useFloating, useFloatingNodeId, useInteractions, useRole } from "@floating-ui/react";

//#region src/hooks/usePopover.ts
const usePopover = (props = {}) => {
	const { bubbles = false, shoudFlip = true, outsidePress, adjustToReferenceWidth = false, referenceElement, canCloseModal, role: roleOption = "dialog" } = props;
	const [isOpen, setIsOpen] = React.useState(props.defaultOpen || false);
	const nodeId = useFloatingNodeId();
	const { update, refs, strategy, x, y, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		elements: { reference: referenceElement?.current },
		nodeId,
		whileElementsMounted: props.autoUpdate === false ? void 0 : autoUpdate,
		placement: props.placement || "bottom-start",
		middleware: [
			offset(props.offset || 6),
			shoudFlip && flip(),
			shift(),
			size({ apply({ elements }) {
				if (typeof adjustToReferenceWidth === "number" || adjustToReferenceWidth === true) {
					const reference = elements.reference;
					const extra = typeof adjustToReferenceWidth === "number" ? adjustToReferenceWidth : 0;
					elements.floating.style.width = reference ? `${reference.offsetWidth + extra}px` : "";
				}
			} })
		]
	});
	const { getReferenceProps, getFloatingProps } = useInteractions([
		useClick(context),
		useDismiss(context, {
			enabled: canCloseModal !== false,
			bubbles,
			outsidePress
		}),
		useRole(context, { role: roleOption })
	]);
	useEffect(() => {
		if (props.defaultOpen) update();
	}, []);
	const toggle = React.useCallback(() => setIsOpen((o) => !o), [setIsOpen]);
	const open = React.useCallback(() => setIsOpen(true), [setIsOpen]);
	const close = React.useCallback(() => setIsOpen(false), [setIsOpen]);
	return {
		reference: refs.setReference,
		floating: refs.setFloating,
		toggle,
		open,
		nodeId,
		close,
		isOpen,
		styles: {
			position: strategy,
			top: y ?? 0,
			left: x ?? 0
		},
		context,
		getReferenceProps,
		getFloatingProps
	};
};

//#endregion
export { usePopover };
//# sourceMappingURL=usePopover.js.map