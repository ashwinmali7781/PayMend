import { withCoreUserGuard } from "../../contexts/CoreUserContext.js";
import { usePopover } from "../../hooks/usePopover.js";
import { useOrganizationSwitcherContext } from "../../contexts/components/OrganizationSwitcher.js";
import { AcceptedInvitationsProvider } from "../../contexts/AcceptedUserInvitations.js";
import { withCardStateProvider, withFloatingTree } from "../../elements/contexts/index.js";
import { Flow } from "../../customizables/Flow.js";
import { Popover } from "../../elements/Popover.js";
import { OrganizationSwitcherPopover } from "./OrganizationSwitcherPopover.js";
import { OrganizationSwitcherTrigger } from "./OrganizationSwitcherTrigger.js";
import { cloneElement, useCallback, useId, useRef } from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationSwitcher/index.tsx
const OrganizationSwitcherWithFloatingTree = withFloatingTree(({ children }) => {
	const { defaultOpen } = useOrganizationSwitcherContext();
	const { floating, reference, styles, toggle, isOpen, nodeId, context, getReferenceProps, getFloatingProps } = usePopover({
		defaultOpen,
		placement: "bottom-start",
		offset: 8
	});
	const switcherButtonMenuId = useId();
	const popoverRef = useRef(null);
	const floatingRef = useCallback((node) => {
		floating(node);
		popoverRef.current = node;
	}, [floating]);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(OrganizationSwitcherTrigger, {
		ref: reference,
		isOpen,
		...getReferenceProps({ "aria-controls": isOpen ? switcherButtonMenuId : void 0 })
	}), /* @__PURE__ */ jsx(Popover, {
		nodeId,
		context,
		isOpen,
		order: ["content"],
		initialFocus: popoverRef,
		children: cloneElement(children, {
			...getFloatingProps({
				id: switcherButtonMenuId,
				tabIndex: -1,
				ref: floatingRef,
				style: styles
			}),
			close: toggle
		})
	})] });
});
const _OrganizationSwitcher = () => {
	const { __experimental_asStandalone } = useOrganizationSwitcherContext();
	return /* @__PURE__ */ jsx(Flow.Root, {
		flow: "organizationSwitcher",
		sx: { display: "inline-flex" },
		children: /* @__PURE__ */ jsx(AcceptedInvitationsProvider, { children: __experimental_asStandalone ? /* @__PURE__ */ jsx(OrganizationSwitcherPopover, { close: typeof __experimental_asStandalone === "function" ? __experimental_asStandalone : void 0 }) : /* @__PURE__ */ jsx(OrganizationSwitcherWithFloatingTree, { children: /* @__PURE__ */ jsx(OrganizationSwitcherPopover, {}) }) })
	});
};
const OrganizationSwitcher = withCoreUserGuard(withCardStateProvider(_OrganizationSwitcher));

//#endregion
export { OrganizationSwitcher };
//# sourceMappingURL=index.js.map