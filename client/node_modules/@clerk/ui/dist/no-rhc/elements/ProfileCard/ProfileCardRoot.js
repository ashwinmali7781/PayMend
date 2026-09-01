import SvgClose from "../../icons/close.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Icon } from "../../customizables/index.js";
import { IconButton } from "../IconButton.js";
import { useUnsafeModalContext } from "../Modal.js";
import { Card } from "../Card/index.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/ProfileCard/ProfileCardRoot.tsx
const ProfileCardRoot = React.forwardRef((props, ref) => {
	const { sx, children, ...rest } = props;
	const { toggle } = useUnsafeModalContext();
	return /* @__PURE__ */ jsxs(Card.Root, {
		ref,
		elevation: "raised",
		sx: [(t) => ({
			width: t.sizes.$220,
			maxWidth: `calc(100vw - ${t.sizes.$8})`,
			display: "flex",
			flexDirection: "row",
			[mqu.md]: {
				display: "flex",
				flexDirection: "column"
			},
			overflow: "hidden",
			height: t.sizes.$176,
			position: "relative"
		}), sx],
		...rest,
		children: [
			toggle && /* @__PURE__ */ jsx(Box, {
				sx: (t) => ({
					[mqu.md]: {
						padding: `${t.space.$1x5} ${t.space.$2}`,
						top: t.space.$none,
						insetInlineEnd: t.space.$none
					},
					zIndex: t.zIndices.$modal,
					position: "absolute",
					top: t.space.$2,
					insetInlineEnd: t.space.$2
				}),
				children: /* @__PURE__ */ jsx(IconButton, {
					elementDescriptor: descriptors.modalCloseButton,
					variant: "ghost",
					"aria-label": "Close modal",
					onClick: toggle,
					icon: /* @__PURE__ */ jsx(Icon, {
						icon: SvgClose,
						size: "md"
					}),
					sx: (t) => ({
						color: t.colors.$colorMutedForeground,
						padding: t.space.$3
					})
				})
			}),
			children,
			/* @__PURE__ */ jsx(Card.Footer, {
				isProfileFooter: true,
				sx: {
					display: "none",
					[mqu.md]: { display: "flex" }
				}
			})
		]
	});
});

//#endregion
export { ProfileCardRoot };
//# sourceMappingURL=ProfileCardRoot.js.map