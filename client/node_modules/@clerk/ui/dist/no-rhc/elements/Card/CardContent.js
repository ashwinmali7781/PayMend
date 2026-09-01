import { useEnvironment } from "../../contexts/EnvironmentContext.js";
import { localizationKeys } from "../../localization/localizationKeys.js";
import SvgClose from "../../icons/close.js";
import { useLocalizations } from "../../localization/makeLocalizable.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { generateFlowPartClassname } from "../../customizables/classGeneration.js";
import { useCardState, useFlowMetadata } from "../contexts/index.js";
import { Flex, Icon } from "../../customizables/index.js";
import { CardAlert } from "./CardAlert.js";
import { IconButton } from "../IconButton.js";
import { useUnsafeModalContext } from "../Modal.js";
import React from "react";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Card/CardContent.tsx
const CardContent = React.forwardRef((props, ref) => {
	const { children, sx, ...rest } = props;
	const flowMetadata = useFlowMetadata();
	const { toggle } = useUnsafeModalContext();
	const { maintenanceMode } = useEnvironment();
	const card = useCardState();
	const { t } = useLocalizations();
	return /* @__PURE__ */ jsxs(Flex, {
		direction: "col",
		className: generateFlowPartClassname(flowMetadata),
		elementDescriptor: descriptors.card,
		sx: [(t) => ({
			backgroundColor: t.colors.$colorBackground,
			transitionProperty: t.transitionProperty.$common,
			transitionDuration: "200ms",
			textAlign: "center",
			zIndex: t.zIndices.$card,
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha150,
			borderRadius: t.radii.$lg,
			position: "relative",
			padding: `${t.space.$8} ${t.space.$10}`,
			justifyContent: "center",
			alignContent: "center",
			marginBlockStart: "-1px",
			marginInline: "-1px"
		}), sx],
		gap: 8,
		ref,
		...rest,
		children: [
			toggle && /* @__PURE__ */ jsx(IconButton, {
				elementDescriptor: descriptors.modalCloseButton,
				variant: "ghost",
				"aria-label": "Close modal",
				onClick: toggle,
				icon: /* @__PURE__ */ jsx(Icon, { icon: SvgClose }),
				sx: (t) => ({
					color: t.colors.$colorMutedForeground,
					zIndex: t.zIndices.$modal,
					position: "absolute",
					top: t.space.$2,
					insetInlineEnd: t.space.$2,
					padding: t.space.$3
				})
			}),
			maintenanceMode && !card.error && /* @__PURE__ */ jsx(CardAlert, {
				variant: "warning",
				children: t(localizationKeys("maintenanceMode"))
			}),
			children
		]
	});
});

//#endregion
export { CardContent };
//# sourceMappingURL=CardContent.js.map