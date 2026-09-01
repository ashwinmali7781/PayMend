import { descriptors } from "../../customizables/elementDescriptors.js";
import { Col } from "../../customizables/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/elements/Action/ActionCard.tsx
const styles = (t) => ({
	neutral: { backgroundColor: t.colors.$colorBackground },
	destructive: { backgroundColor: t.colors.$neutralAlpha50 }
});
const ActionCard = (props) => {
	const { children, sx, variant = "neutral", ...rest } = props;
	return /* @__PURE__ */ jsx(Col, {
		elementDescriptor: descriptors.actionCard,
		sx: [(t) => ({
			gap: t.space.$4,
			borderRadius: t.radii.$lg,
			padding: `${t.space.$4} ${t.space.$5}`,
			borderWidth: t.borderWidths.$normal,
			borderStyle: t.borderStyles.$solid,
			borderColor: t.colors.$borderAlpha150,
			...styles(t)[variant]
		}), sx],
		...rest,
		children
	});
};

//#endregion
export { ActionCard };
//# sourceMappingURL=ActionCard.js.map