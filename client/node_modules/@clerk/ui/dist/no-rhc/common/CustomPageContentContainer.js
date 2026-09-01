import { ExternalElementMounter } from "../utils/ExternalElementMounter.js";
import { descriptors } from "../customizables/elementDescriptors.js";
import { Col } from "../customizables/index.js";
import { ProfileCard } from "../elements/ProfileCard/index.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/common/CustomPageContentContainer.tsx
const CustomPageContentContainer = ({ mount, unmount }) => {
	return /* @__PURE__ */ jsx(ProfileCard.Page, { children: /* @__PURE__ */ jsx(Col, {
		elementDescriptor: descriptors.page,
		gap: 8,
		children: /* @__PURE__ */ jsx(Col, {
			elementDescriptor: descriptors.profilePage,
			gap: 8,
			children: /* @__PURE__ */ jsx(ExternalElementMounter, {
				mount,
				unmount
			})
		})
	}) });
};

//#endregion
export { CustomPageContentContainer };
//# sourceMappingURL=CustomPageContentContainer.js.map