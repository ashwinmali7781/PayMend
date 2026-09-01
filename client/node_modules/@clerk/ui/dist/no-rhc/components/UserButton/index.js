import { withCoreUserGuard } from "../../contexts/CoreUserContext.js";
import { usePopover } from "../../hooks/usePopover.js";
import { useUserButtonContext } from "../../contexts/components/UserButton.js";
import { withCardStateProvider, withFloatingTree } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Popover } from "../../elements/Popover.js";
import { UserButtonPopover } from "./UserButtonPopover.js";
import { UserButtonTrigger } from "./UserButtonTrigger.js";
import { cloneElement, useCallback, useId, useRef } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/UserButton/index.tsx
const UserButtonWithFloatingTree = withFloatingTree(({ children }) => {
	const { defaultOpen } = useUserButtonContext();
	const { floating, reference, styles, toggle, isOpen, nodeId, context, getReferenceProps, getFloatingProps } = usePopover({
		defaultOpen,
		placement: "bottom-end",
		offset: 8
	});
	const userButtonMenuId = useId();
	const popoverRef = useRef(null);
	const floatingRef = useCallback((node) => {
		floating(node);
		popoverRef.current = node;
	}, [floating]);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(UserButtonTrigger, {
		ref: reference,
		isOpen,
		...getReferenceProps({ "aria-controls": isOpen ? userButtonMenuId : void 0 })
	}), /* @__PURE__ */ jsx(Popover, {
		nodeId,
		context,
		isOpen,
		order: ["content"],
		initialFocus: popoverRef,
		children: cloneElement(children, {
			...getFloatingProps({
				id: userButtonMenuId,
				tabIndex: -1,
				ref: floatingRef,
				style: styles
			}),
			close: toggle
		})
	})] });
});
const _UserButton = () => {
	const { __experimental_asStandalone } = useUserButtonContext();
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "userButton",
		sx: { display: "inline-flex" },
		children: __experimental_asStandalone ? /* @__PURE__ */ jsx(UserButtonPopover, { close: typeof __experimental_asStandalone === "function" ? __experimental_asStandalone : void 0 }) : /* @__PURE__ */ jsx(UserButtonWithFloatingTree, { children: /* @__PURE__ */ jsx(UserButtonPopover, {}) })
	});
};
const UserButton = withCoreUserGuard(withCardStateProvider(_UserButton));

//#endregion
export { UserButton };
//# sourceMappingURL=index.js.map