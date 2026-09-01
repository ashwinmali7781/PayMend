import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState, withCardStateProvider } from "./contexts/index.js";
import { Flex, Spinner } from "../customizables/index.js";
import { Card } from "./Card/index.js";
import { CaptchaElement } from "./CaptchaElement.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/LoadingCard.tsx
const LoadingCardContainer = ({ children }) => {
	return /* @__PURE__ */ jsxs(Flex, {
		direction: "col",
		center: true,
		elementDescriptor: descriptors.main,
		gap: 8,
		sx: (theme) => ({
			marginTop: theme.space.$16,
			marginBottom: theme.space.$13
		}),
		children: [/* @__PURE__ */ jsx(Spinner, {
			size: "xl",
			colorScheme: "primary",
			elementDescriptor: descriptors.spinner
		}), children]
	});
};
const LoadingCard = withCardStateProvider(() => {
	const card = useCardState();
	return /* @__PURE__ */ jsxs(Card.Root, { children: [/* @__PURE__ */ jsxs(Card.Content, { children: [
		/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
		/* @__PURE__ */ jsx(LoadingCardContainer, {}),
		/* @__PURE__ */ jsx(CaptchaElement, {})
	] }), /* @__PURE__ */ jsx(Card.Footer, {})] });
});

//#endregion
export { LoadingCard, LoadingCardContainer };
//# sourceMappingURL=LoadingCard.js.map