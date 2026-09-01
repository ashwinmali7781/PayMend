import { useCardState } from "./contexts/index.js";
import { Button, Icon } from "../customizables/index.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/PreviewButton.tsx
const PreviewButton = (props) => {
	const { sx, children, icon, iconProps, showIconOnHover = true, ...rest } = props;
	const card = useCardState();
	const { sx: iconSx, ...restIconProps } = iconProps || {};
	return /* @__PURE__ */ jsxs(Button, {
		variant: "ghost",
		colorScheme: "neutral",
		focusRing: false,
		block: true,
		hoverAsFocus: true,
		isDisabled: card.isLoading,
		sx: [(t) => ({
			justifyContent: "space-between",
			padding: `${t.space.$4} ${t.space.$5}`,
			borderRadius: 0,
			...showIconOnHover ? { ":hover > svg": { visibility: "initial" } } : {}
		}), sx],
		...rest,
		children: [children, icon && /* @__PURE__ */ jsx(Icon, {
			icon,
			sx: [(t) => ({
				color: t.colors.$colorMutedForeground,
				marginInlineStart: t.space.$2,
				visibility: showIconOnHover ? "hidden" : "initial"
			}), iconSx],
			...restIconProps
		})]
	});
};

//#endregion
export { PreviewButton };
//# sourceMappingURL=PreviewButton.js.map