import SvgThreeDots from "../icons/three-dots.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Button, Icon } from "../customizables/index.js";
import { Menu, MenuItem, MenuList, MenuTrigger } from "./Menu.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/ThreeDotsMenu.tsx
const ThreeDotsMenu = (props) => {
	const { actions, elementId, variant } = props;
	const isBordered = variant === "bordered";
	const iconSx = (t) => !isBordered ? {
		width: "auto",
		height: t.sizes.$5
	} : {
		width: t.sizes.$4,
		height: t.sizes.$4,
		opacity: t.opacity.$inactive
	};
	return /* @__PURE__ */ jsxs(Menu, {
		elementId,
		children: [/* @__PURE__ */ jsx(MenuTrigger, {
			ariaLabel: (isOpen) => `${isOpen ? "Close" : "Open"} menu`,
			children: /* @__PURE__ */ jsx(Button, {
				sx: (t) => !isBordered ? {
					padding: t.space.$0x5,
					boxSizing: "content-box",
					opacity: t.opacity.$inactive,
					":hover,:focus-visible": { opacity: 1 }
				} : {
					width: t.sizes.$6,
					height: t.sizes.$6
				},
				variant: isBordered ? "bordered" : "ghost",
				colorScheme: isBordered ? "secondary" : "neutral",
				elementDescriptor: [descriptors.menuButton, isBordered ? descriptors.menuButtonEllipsisBordered : descriptors.menuButtonEllipsis],
				children: /* @__PURE__ */ jsx(Icon, {
					icon: SvgThreeDots,
					sx: iconSx
				})
			})
		}), /* @__PURE__ */ jsx(MenuList, { children: actions.map((a, index) => /* @__PURE__ */ jsx(MenuItem, {
			destructive: a.isDestructive,
			onClick: a.onClick,
			isDisabled: a.isDisabled,
			localizationKey: a.label
		}, index)) })]
	});
};

//#endregion
export { ThreeDotsMenu };
//# sourceMappingURL=ThreeDotsMenu.js.map