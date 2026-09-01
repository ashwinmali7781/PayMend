import { descriptors } from "../customizables/elementDescriptors.js";
import { useCardState } from "./contexts/index.js";
import { Col } from "../customizables/index.js";
import { Card } from "./Card/index.js";
import { Header } from "./Header.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/FormContainer.tsx
const FormContainer = (props) => {
	const { headerTitle, headerTitleTextVariant = "h3", headerSubtitle, headerSubtitleTextVariant = "body", badgeText, children, sx, ...rest } = props;
	const card = useCardState();
	return /* @__PURE__ */ jsxs(Col, {
		elementDescriptor: descriptors.formContainer,
		gap: 8,
		...rest,
		sx: [sx],
		children: [
			(headerTitle || headerSubtitle) && /* @__PURE__ */ jsxs(Header.Root, {
				badgeText,
				children: [headerTitle && /* @__PURE__ */ jsx(Header.Title, {
					textVariant: headerTitleTextVariant,
					...typeof headerTitle === "string" ? { children: headerTitle } : { localizationKey: headerTitle }
				}), headerSubtitle && /* @__PURE__ */ jsx(Header.Subtitle, {
					variant: headerSubtitleTextVariant,
					...typeof headerSubtitle === "string" ? { children: headerSubtitle } : { localizationKey: headerSubtitle }
				})]
			}),
			/* @__PURE__ */ jsx(Card.Alert, { children: card.error }),
			/* @__PURE__ */ jsx(Col, {
				gap: 8,
				children
			})
		]
	});
};

//#endregion
export { FormContainer };
//# sourceMappingURL=FormContainer.js.map