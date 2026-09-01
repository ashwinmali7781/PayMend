import { descriptors } from "../../customizables/elementDescriptors.js";
import { Col } from "../../customizables/index.js";
import { Card } from "../Card/index.js";
import { Header } from "../Header.js";
import { jsx, jsxs } from "@emotion/react/jsx-runtime";

//#region src/elements/ProfileCard/ProfilePagePanel.tsx
const ProfilePagePanel = ({ children, pageId, titleKey, alertContent, outerSx }) => {
	return /* @__PURE__ */ jsx(Col, {
		elementDescriptor: descriptors.page,
		sx: outerSx ?? ((t) => ({
			gap: t.space.$8,
			isolation: "isolate"
		})),
		children: /* @__PURE__ */ jsxs(Col, {
			elementDescriptor: descriptors.profilePage,
			elementId: descriptors.profilePage.setId(pageId),
			children: [
				/* @__PURE__ */ jsx(Header.Root, { children: /* @__PURE__ */ jsx(Header.Title, {
					localizationKey: titleKey,
					sx: (t) => ({ marginBottom: t.space.$4 }),
					textVariant: "h2"
				}) }),
				alertContent !== void 0 && /* @__PURE__ */ jsx(Card.Alert, { children: alertContent }),
				children
			]
		})
	});
};

//#endregion
export { ProfilePagePanel };
//# sourceMappingURL=ProfilePagePanel.js.map