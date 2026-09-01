import { AppearanceContext, useAppearance } from "../../customizables/AppearanceContext.js";
import { mqu } from "../../styledSystem/breakpoints.js";
import { descriptors } from "../../customizables/elementDescriptors.js";
import { generateFlowPartClassname } from "../../customizables/classGeneration.js";
import { useFlowMetadata } from "../contexts/index.js";
import { Col } from "../../customizables/index.js";
import { ModalContext } from "../Modal.js";
import { ApplicationLogo } from "../ApplicationLogo.js";
import React from "react";
import { Fragment as Fragment$1, jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/Card/CardRoot.tsx
const getFlushElements = (t) => ({
	cardBox: {
		borderWidth: 0,
		borderRadius: 0,
		boxShadow: "none",
		overflow: "visible"
	},
	card: {
		borderWidth: 0,
		borderRadius: 0,
		boxShadow: "none",
		backgroundColor: "transparent",
		paddingInline: 0,
		paddingBlock: 0,
		marginBlockStart: 0,
		marginInline: 0
	},
	footer: {
		background: "transparent",
		marginTop: t.space.$8,
		paddingTop: 0,
		rowGap: t.space.$8,
		">:first-of-type": { padding: 0 },
		">:not(:first-of-type)": {
			borderTopWidth: 0,
			padding: 0
		},
		"& [data-clerk-dev-mode-overlay]": { display: "none" },
		"& [data-clerk-dev-mode-notice]": {
			alignSelf: "center",
			marginBottom: `calc(${t.space.$2} * -1)`,
			marginInline: "auto",
			padding: 0,
			textAlign: "center"
		}
	}
});
const CardRoot = React.forwardRef((props, ref) => {
	const { sx, children, elevation: elevationProp, ...rest } = props;
	const appearance = useAppearance();
	const flowMetadata = useFlowMetadata();
	const isModal = React.useContext(ModalContext) !== void 0;
	const isFlush = (elevationProp ?? (isModal ? "raised" : appearance.parsedOptions.elevation)) === "flush";
	const augmentedAppearance = React.useMemo(() => {
		if (!isFlush) return appearance;
		const flushElements = getFlushElements(appearance.parsedInternalTheme);
		const newParsedElements = [
			appearance.parsedElements[0],
			flushElements,
			...appearance.parsedElements.slice(1)
		];
		return {
			...appearance,
			parsedElements: newParsedElements
		};
	}, [appearance, isFlush]);
	const cardBox = /* @__PURE__ */ jsx(Col, {
		elementDescriptor: [descriptors.cardBox, props.elementDescriptor],
		className: generateFlowPartClassname(flowMetadata),
		ref,
		"data-elevation": isFlush ? "flush" : void 0,
		sx: [(t) => ({
			isolation: "isolate",
			maxWidth: `calc(100vw - ${t.sizes.$10})`,
			width: t.sizes.$100,
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha150,
			borderRadius: t.radii.$xl,
			color: t.colors.$colorForeground,
			position: "relative",
			overflow: "hidden"
		}), sx],
		...rest,
		children
	});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [appearance.parsedOptions.logoPlacement === "outside" && /* @__PURE__ */ jsx(ApplicationLogo, { sx: (t) => ({
		position: "relative",
		[mqu.sm]: { margin: `0 0 ${t.space.$7} 0` }
	}) }), isFlush ? /* @__PURE__ */ jsx(AppearanceContext.Provider, {
		value: { value: augmentedAppearance },
		children: cardBox
	}) : cardBox] });
});

//#endregion
export { CardRoot };
//# sourceMappingURL=CardRoot.js.map