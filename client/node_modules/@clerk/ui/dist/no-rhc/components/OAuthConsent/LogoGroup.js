import SvgLockDottedCircle from "../../icons/lock-dotted-circle.js";
import { colors } from "../../utils/colors/index.js";
import { common } from "../../styledSystem/common.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { Box, Flex, Icon } from "../../customizables/index.js";
import React from "react";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OAuthConsent/LogoGroup.tsx
function LogoGroup({ children }) {
	return /* @__PURE__ */ jsx(Flex, {
		justify: "center",
		align: "center",
		gap: 4,
		sx: (t) => ({ marginBlockEnd: t.space.$6 }),
		elementDescriptor: descriptors.logoGroup,
		children
	});
}
function LogoGroupItem({ children, sx, ...props }) {
	return /* @__PURE__ */ jsx(Flex, {
		...props,
		sx: [{ flex: 1 }, sx],
		elementDescriptor: descriptors.logoGroupItem,
		children
	});
}
function LogoGroupItemContainer({ size = "md", sx, children }) {
	const scale = (t) => {
		const container = size === "sm" ? t.space.$6 : t.space.$12;
		const inner = size === "sm" ? t.space.$3 : t.space.$5;
		return {
			width: container,
			height: container,
			"&& > *": {
				width: inner,
				height: inner
			}
		};
	};
	return /* @__PURE__ */ jsx(Box, {
		sx: (t) => [
			{
				background: common.mergedColorsBackground(colors.setAlpha(t.colors.$colorBackground, 1), t.colors.$neutralAlpha50),
				borderRadius: t.radii.$circle,
				borderWidth: t.borderWidths.$normal,
				borderStyle: t.borderStyles.$solid,
				borderColor: t.colors.$borderAlpha100,
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			},
			scale,
			sx
		],
		elementDescriptor: descriptors.logoGroupItemContainer,
		children
	});
}
function LogoGroupIcon({ icon = SvgLockDottedCircle, iconSx = (t) => ({ color: t.colors.$primary500 }), label }) {
	return /* @__PURE__ */ jsx(Icon, {
		icon,
		sx: iconSx,
		elementDescriptor: descriptors.logoGroupIcon,
		role: label ? "img" : void 0,
		"aria-label": label,
		"aria-hidden": label ? void 0 : true
	});
}
function LogoGroupSeparator() {
	return /* @__PURE__ */ jsx(Box, {
		as: "svg",
		fill: "none",
		viewBox: "0 0 16 2",
		height: 2,
		"aria-hidden": true,
		sx: (t) => ({ color: t.colors.$colorMutedForeground }),
		elementDescriptor: descriptors.logoGroupSeparator,
		children: /* @__PURE__ */ jsx("path", {
			stroke: "currentColor",
			strokeDasharray: "0.1 4",
			strokeLinecap: "round",
			strokeWidth: "2",
			d: "M1 1h14"
		})
	});
}

//#endregion
export { LogoGroup, LogoGroupIcon, LogoGroupItem, LogoGroupItemContainer, LogoGroupSeparator };
//# sourceMappingURL=LogoGroup.js.map