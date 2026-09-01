import { usePopover } from "../hooks/usePopover.js";
import { useScrollLock } from "../hooks/useScrollLock.js";
import { animations } from "../styledSystem/animations.js";
import { mqu } from "../styledSystem/breakpoints.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { withFloatingTree } from "./contexts/index.js";
import { Flex } from "../customizables/index.js";
import { Popover } from "./Popover.js";
import React, { useRef } from "react";
import { createContextAndHook, usePortalRoot, useSafeLayoutEffect } from "@clerk/shared/react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/Modal.tsx
const [ModalContext, _, useUnsafeModalContext] = createContextAndHook("ModalContext");
const Modal = withFloatingTree((props) => {
	const { disableScrollLock, enableScrollLock } = useScrollLock();
	const { handleClose, handleOpen, contentSx, containerSx, canCloseModal, id, style, portalRoot, initialFocusRef } = props;
	const portalRootFromContext = usePortalRoot();
	const overlayRef = useRef(null);
	const { floating, isOpen, context, nodeId, toggle } = usePopover({
		defaultOpen: true,
		autoUpdate: false,
		outsidePress: (e) => e.target === overlayRef.current,
		canCloseModal
	});
	React.useEffect(() => {
		if (!isOpen) handleClose?.();
		else handleOpen?.();
	}, [isOpen]);
	const modalCtx = React.useMemo(() => ({ value: canCloseModal === false ? {} : { toggle } }), [toggle, canCloseModal]);
	useSafeLayoutEffect(() => {
		enableScrollLock();
		return () => {
			disableScrollLock();
		};
	}, []);
	return /* @__PURE__ */ jsx(Popover, {
		nodeId,
		context,
		isOpen,
		outsideElementsInert: true,
		root: portalRoot ?? portalRootFromContext?.() ?? void 0,
		initialFocus: initialFocusRef,
		children: /* @__PURE__ */ jsx(ModalContext.Provider, {
			value: modalCtx,
			children: /* @__PURE__ */ jsx(Flex, {
				id,
				ref: overlayRef,
				elementDescriptor: descriptors.modalBackdrop,
				style,
				sx: [(t) => ({
					animation: `${animations.fadeIn} 150ms ${t.transitionTiming.$common}`,
					zIndex: t.zIndices.$modal,
					backgroundColor: t.colors.$colorModalBackdrop,
					alignItems: "flex-start",
					justifyContent: "center",
					overflow: "auto",
					width: "100vw",
					height: ["100vh", "-webkit-fill-available"],
					position: "fixed",
					left: 0,
					top: 0
				}), containerSx],
				children: /* @__PURE__ */ jsx(Flex, {
					elementDescriptor: descriptors.modalContent,
					ref: floating,
					"aria-modal": "true",
					role: "dialog",
					sx: [(t) => ({
						position: "relative",
						outline: 0,
						animation: `${animations.modalSlideAndFade} 180ms ${t.transitionTiming.$easeOut}`,
						margin: `${t.space.$16} 0`,
						[mqu.sm]: { margin: `${t.space.$10} 0` }
					}), contentSx],
					children: props.children
				})
			})
		})
	});
});

//#endregion
export { Modal, ModalContext, useUnsafeModalContext };
//# sourceMappingURL=Modal.js.map