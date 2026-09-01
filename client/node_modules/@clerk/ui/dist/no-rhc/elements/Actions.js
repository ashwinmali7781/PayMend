import { useLoadingStatus } from "../hooks/useLoadingStatus.js";
import { useLocalizations } from "../localization/makeLocalizable.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState } from "./contexts/index.js";
import { Button, Col, Flex, Icon, Spinner } from "../customizables/index.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Actions.tsx
const Actions = (props) => {
	const { sx, ...rest } = props;
	return /* @__PURE__ */ jsx(Col, {
		sx: [(t) => ({
			"> button,div": { border: `0 solid ${t.colors.$borderAlpha100}` },
			">:not([hidden],:empty)~:not([hidden],:empty)": {
				borderTopWidth: "1px",
				borderBottomWidth: "0"
			}
		}), sx],
		...rest
	});
};
const SmallActions = (props) => {
	return /* @__PURE__ */ jsx(Col, { ...props });
};
const SmallAction = (props) => {
	const { sx, iconBoxSx, iconSx, ...rest } = props;
	return /* @__PURE__ */ jsx(Action, {
		size: "xs",
		variant: "outline",
		textVariant: "buttonSmall",
		sx: [(t) => ({
			borderRadius: t.radii.$md,
			gap: t.space.$0x5,
			justifyContent: "center",
			flex: "1 1 0",
			padding: `${t.space.$1} ${t.space.$1x5}`
		}), sx],
		iconSx: [(t) => ({
			width: t.sizes.$4,
			height: t.sizes.$4
		}), iconSx],
		iconBoxSx: [{ flex: "unset" }, iconBoxSx],
		...rest
	});
};
const Action = (props) => {
	const card = useCardState();
	const status = useLoadingStatus();
	const { t } = useLocalizations();
	const { icon, label, onClick: onClickProp, iconElementDescriptor, sx, iconElementId, iconSx, iconBoxElementDescriptor, iconBoxElementId, iconBoxSx, trailing, spinnerSize, ...rest } = props;
	const onClick = async (e) => {
		card.setLoading();
		status.setLoading();
		try {
			await onClickProp?.(e);
		} finally {
			card.setIdle();
			status.setIdle();
		}
	};
	return /* @__PURE__ */ jsxs(Button, {
		size: "md",
		variant: "ghost",
		colorScheme: "neutral",
		textVariant: "buttonLarge",
		hoverAsFocus: true,
		focusRing: false,
		sx: [(t) => ({
			flex: "1",
			borderRadius: 0,
			gap: t.space.$4,
			justifyContent: "flex-start"
		}), sx],
		isDisabled: card.isLoading,
		onClick,
		...rest,
		children: [
			/* @__PURE__ */ jsx(Flex, {
				elementDescriptor: iconBoxElementDescriptor,
				elementId: iconBoxElementId,
				justify: "center",
				as: "span",
				sx: [(t) => ({
					flex: `0 0 ${t.sizes.$9}`,
					gap: t.space.$2,
					alignItems: "center"
				}), iconBoxSx],
				children: status.isLoading ? /* @__PURE__ */ jsx(Spinner, {
					size: spinnerSize || "xs",
					elementDescriptor: descriptors.spinner,
					sx: (t) => ({ marginInlineEnd: t.space.$1 })
				}) : /* @__PURE__ */ jsx(Icon, {
					elementDescriptor: iconElementDescriptor,
					elementId: iconElementId,
					icon,
					sx: [(t) => ({
						width: t.sizes.$4,
						height: "auto",
						maxWidth: "100%"
					}), iconSx]
				})
			}),
			label ? t(label) : null,
			trailing
		]
	});
};

//#endregion
export { Action, Actions, SmallAction, SmallActions };
//# sourceMappingURL=Actions.js.map