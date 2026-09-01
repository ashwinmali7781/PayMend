import { descriptors } from "../../customizables/elementDescriptors.js";
import { OrganizationPreviewButton, OrganizationPreviewListItem, OrganizationPreviewListItemButton, OrganizationPreviewListItems } from "../../common/organizations/OrganizationPreview.js";
import { jsx } from "@emotion/react/jsx-runtime";

//#region src/components/OrganizationList/shared.tsx
const PreviewListItems = (props) => {
	return /* @__PURE__ */ jsx(OrganizationPreviewListItems, {
		elementDescriptor: descriptors.organizationListPreviewItems,
		...props
	});
};
const PreviewListItem = (props) => {
	return /* @__PURE__ */ jsx(OrganizationPreviewListItem, {
		elementId: "organizationList",
		elementDescriptor: descriptors.organizationListPreviewItem,
		...props
	});
};
const PreviewListItemButton = (props) => {
	return /* @__PURE__ */ jsx(OrganizationPreviewListItemButton, {
		elementDescriptor: descriptors.organizationListPreviewItemActionButton,
		...props
	});
};
const OrganizationListPreviewButton = (props) => {
	return /* @__PURE__ */ jsx(OrganizationPreviewButton, {
		elementDescriptor: descriptors.organizationListPreviewButton,
		...props
	});
};

//#endregion
export { OrganizationListPreviewButton, PreviewListItem, PreviewListItemButton, PreviewListItems };
//# sourceMappingURL=shared.js.map